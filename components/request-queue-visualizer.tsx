"use client"

import { useEffect, useRef } from "react"

interface RequestQueueVisualizerProps {
  batchSize: number
  isRunning: boolean
  isTritonEnabled: boolean
  progress: number
}

export default function RequestQueueVisualizer({
  batchSize,
  isRunning,
  isTritonEnabled,
  progress,
}: RequestQueueVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestsRef = useRef<any[]>([])
  const batchesRef = useRef<any[]>([])
  const animationRef = useRef<number | null>(null)

  // Initialize requests
  useEffect(() => {
    if (!isRunning) return

    // Create 50 requests
    const requests = []
    for (let i = 0; i < 50; i++) {
      requests.push({
        id: i,
        x: 50,
        y: 20 + i * 10,
        status: "waiting", // waiting, batched, processing, completed
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
        batchId: null,
      })
    }
    requestsRef.current = requests
    batchesRef.current = []

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning])

  // Animation loop
  useEffect(() => {
    if (!isRunning || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    let lastTimestamp = performance.now()

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTimestamp
      lastTimestamp = timestamp

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background sections
      const sectionWidth = canvas.width / 3

      // Queue section
      ctx.fillStyle = "rgba(241, 245, 249, 0.5)"
      ctx.fillRect(0, 0, sectionWidth, canvas.height)

      // Batching section
      ctx.fillStyle = "rgba(226, 232, 240, 0.5)"
      ctx.fillRect(sectionWidth, 0, sectionWidth, canvas.height)

      // Processing section
      ctx.fillStyle = "rgba(203, 213, 225, 0.5)"
      ctx.fillRect(sectionWidth * 2, 0, sectionWidth, canvas.height)

      // Draw section labels
      ctx.font = "bold 14px sans-serif"
      ctx.fillStyle = "#64748b"
      ctx.textAlign = "center"
      ctx.fillText("Request Queue", sectionWidth / 2, 15)
      ctx.fillText("Batching", sectionWidth * 1.5, 15)
      ctx.fillText("Processing", sectionWidth * 2.5, 15)

      // Update requests
      const requests = requestsRef.current
      const batches = batchesRef.current

      // Create new batches if using Triton
      if (isTritonEnabled && requests.some((r) => r.status === "waiting")) {
        const waitingRequests = requests.filter((r) => r.status === "waiting")

        // Create batches of the specified size
        while (waitingRequests.length > 0 && waitingRequests.length >= batchSize) {
          const batchRequests = waitingRequests.splice(0, batchSize)
          const batchId = batches.length

          // Create a new batch
          batches.push({
            id: batchId,
            requests: batchRequests,
            x: sectionWidth + 50,
            y: 50 + batches.length * 40,
            status: "forming", // forming, processing, completed
            progress: 0,
          })

          // Update request status
          batchRequests.forEach((request) => {
            const req = requests.find((r) => r.id === request.id)
            if (req) {
              req.status = "batched"
              req.batchId = batchId
            }
          })
        }
      }

      // Process requests individually if not using Triton
      if (!isTritonEnabled) {
        const waitingRequests = requests.filter((r) => r.status === "waiting")
        const processingRequests = requests.filter((r) => r.status === "processing")

        // Start processing new requests if less than 3 are currently processing
        if (processingRequests.length < 3 && waitingRequests.length > 0) {
          const request = waitingRequests[0]
          request.status = "processing"
          request.x = sectionWidth * 2 + 50
        }

        // Update processing requests
        requests.forEach((request) => {
          if (request.status === "processing") {
            request.progress = (request.progress || 0) + deltaTime / 50

            if (request.progress >= 100) {
              request.status = "completed"
              request.x = canvas.width + 50 // Move off screen
            }
          }
        })
      }

      // Update batches
      batches.forEach((batch) => {
        if (batch.status === "forming") {
          // Move batch to processing after a delay
          batch.formingTime = (batch.formingTime || 0) + deltaTime
          if (batch.formingTime > 500) {
            batch.status = "processing"
            batch.x = sectionWidth * 2 + 50
          }
        } else if (batch.status === "processing") {
          // Update batch progress
          batch.progress = (batch.progress || 0) + deltaTime / 30

          if (batch.progress >= 100) {
            batch.status = "completed"
            batch.x = canvas.width + 50 // Move off screen

            // Update request status
            batch.requests.forEach((request: any) => {
              const req = requests.find((r) => r.id === request.id)
              if (req) {
                req.status = "completed"
                req.x = canvas.width + 50 // Move off screen
              }
            })
          }
        }
      })

      // Move requests towards their targets
      requests.forEach((request) => {
        let targetX = 50 // Default position in queue

        if (request.status === "batched") {
          const batch = batches.find((b) => b.id === request.batchId)
          if (batch) {
            targetX = batch.x
          }
        } else if (request.status === "processing") {
          targetX = sectionWidth * 2 + 50
        } else if (request.status === "completed") {
          targetX = canvas.width + 50
        }

        // Move towards target
        request.x += (targetX - request.x) * 0.1
      })

      // Draw requests
      requests.forEach((request) => {
        if (request.x > canvas.width) return // Skip if off screen

        ctx.beginPath()
        ctx.rect(request.x, request.y, 15, 8)
        ctx.fillStyle = request.color
        ctx.fill()

        // Draw progress bar for processing requests
        if (request.status === "processing" && !isTritonEnabled) {
          ctx.beginPath()
          ctx.rect(request.x, request.y + 10, 15 * (request.progress / 100), 2)
          ctx.fillStyle = "#10b981"
          ctx.fill()
        }
      })

      // Draw batches
      batches.forEach((batch) => {
        if (batch.x > canvas.width) return // Skip if off screen

        ctx.beginPath()
        ctx.rect(batch.x - 10, batch.y - 10, 35, 35)
        ctx.fillStyle = "rgba(79, 70, 229, 0.2)"
        ctx.fill()
        ctx.strokeStyle = "rgba(79, 70, 229, 0.6)"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw batch label
        ctx.font = "bold 12px sans-serif"
        ctx.fillStyle = "#4f46e5"
        ctx.textAlign = "center"
        ctx.fillText(`B${batch.id}`, batch.x + 8, batch.y + 8)

        // Draw progress bar for processing batches
        if (batch.status === "processing") {
          ctx.beginPath()
          ctx.rect(batch.x - 10, batch.y + 30, 35 * (batch.progress / 100), 4)
          ctx.fillStyle = "#10b981"
          ctx.fill()
        }
      })

      // Continue animation if still running
      if (progress < 100) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, isTritonEnabled, batchSize, progress])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

