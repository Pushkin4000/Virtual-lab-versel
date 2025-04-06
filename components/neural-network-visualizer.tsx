"use client"

import { useEffect, useRef } from "react"

interface NeuralNetworkVisualizerProps {
  isOptimized: boolean
  precision: number
}

export default function NeuralNetworkVisualizer({ isOptimized, precision }: NeuralNetworkVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Define network structure
    const layers = isOptimized ? [4, 6, 6, 3] : [4, 8, 8, 6, 3]
    const nodeRadius = 10
    const layerSpacing = canvas.width / (layers.length + 1)

    // Draw nodes and connections
    for (let l = 0; l < layers.length; l++) {
      const layerSize = layers[l]
      const layerX = (l + 1) * layerSpacing
      const nodeSpacing = canvas.height / (layerSize + 1)

      for (let n = 0; n < layerSize; n++) {
        const nodeY = (n + 1) * nodeSpacing

        // Draw node
        ctx.beginPath()
        ctx.arc(layerX, nodeY, nodeRadius, 0, Math.PI * 2)

        // Color based on precision and optimization
        if (isOptimized) {
          if (precision === 8) {
            ctx.fillStyle = "rgba(34, 197, 94, 0.7)" // Green for INT8
          } else if (precision === 16) {
            ctx.fillStyle = "rgba(59, 130, 246, 0.7)" // Blue for FP16
          } else {
            ctx.fillStyle = "rgba(99, 102, 241, 0.7)" // Indigo for FP32
          }
        } else {
          ctx.fillStyle = "rgba(99, 102, 241, 0.7)" // Default color
        }

        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw connections to previous layer
        if (l > 0) {
          const prevLayerSize = layers[l - 1]
          const prevLayerX = l * layerSpacing
          const prevNodeSpacing = canvas.height / (prevLayerSize + 1)

          for (let pn = 0; pn < prevLayerSize; pn++) {
            const prevNodeY = (pn + 1) * prevNodeSpacing

            // Only draw some connections to avoid clutter
            if ((pn + n) % 2 === 0 || isOptimized) {
              ctx.beginPath()
              ctx.moveTo(prevLayerX + nodeRadius, prevNodeY)
              ctx.lineTo(layerX - nodeRadius, nodeY)

              if (isOptimized) {
                ctx.strokeStyle = "rgba(99, 102, 241, 0.3)"
                ctx.lineWidth = 2
              } else {
                ctx.strokeStyle = "rgba(99, 102, 241, 0.2)"
                ctx.lineWidth = 1
              }

              ctx.stroke()
            }
          }
        }
      }
    }

    // Draw layer labels
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "center"

    const layerLabels = isOptimized
      ? ["Input", "Hidden", "Hidden", "Output"]
      : ["Input", "Hidden", "Hidden", "Hidden", "Output"]

    for (let l = 0; l < layers.length; l++) {
      const layerX = (l + 1) * layerSpacing
      ctx.fillText(layerLabels[l], layerX, canvas.height - 10)
    }

    // Draw optimization indicators
    if (isOptimized) {
      ctx.font = "bold 14px sans-serif"
      ctx.fillStyle = "#059669"
      ctx.textAlign = "center"
      ctx.fillText("Optimized Network", canvas.width / 2, 20)

      // Draw fusion indicators
      const midX = (2 * layerSpacing + 3 * layerSpacing) / 2
      const midY = canvas.height / 2

      ctx.beginPath()
      ctx.ellipse(midX, midY, layerSpacing * 0.8, canvas.height * 0.4, 0, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(5, 150, 105, 0.5)"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = "rgba(5, 150, 105, 0.1)"
      ctx.fill()

      ctx.font = "12px sans-serif"
      ctx.fillStyle = "#059669"
      ctx.textAlign = "center"
      ctx.fillText("Fused Layers", midX, midY - canvas.height * 0.3)
    } else {
      ctx.font = "bold 14px sans-serif"
      ctx.fillStyle = "#6366f1"
      ctx.textAlign = "center"
      ctx.fillText("Original Network", canvas.width / 2, 20)
    }
  }, [isOptimized, precision])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

