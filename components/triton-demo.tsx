"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon, Zap, Server } from "lucide-react"
import RequestQueueVisualizer from "./request-queue-visualizer"

interface TritonDemoProps {
  onComplete: () => void
}

export default function TritonDemo({ onComplete }: TritonDemoProps) {
  const [batchSize, setBatchSize] = useState(8)
  const [isRunning, setIsRunning] = useState(false)
  const [isTritonEnabled, setIsTritonEnabled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [gpuUtilization, setGpuUtilization] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const animationRef = useRef<number | null>(null)

  const handleBatchSizeChange = (value: number[]) => {
    setBatchSize(value[0])
  }

  const runSimulation = (useTriton: boolean) => {
    if (isRunning) return

    setIsRunning(true)
    setIsTritonEnabled(useTriton)
    setProgress(0)
    setGpuUtilization(0)
    setTotalTime(0)
    setIsComplete(false)

    const startTime = performance.now()
    let lastTimestamp = startTime

    // Simulate processing
    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const delta = timestamp - lastTimestamp
      lastTimestamp = timestamp

      // Calculate progress
      const duration = useTriton ? 3000 : 5000
      const newProgress = Math.min(100, (elapsed / duration) * 100)
      setProgress(newProgress)

      // Simulate GPU utilization
      if (useTriton) {
        // Triton ramps up GPU utilization quickly
        if (elapsed < 500) {
          setGpuUtilization(Math.min(85, (elapsed / 500) * 85))
        } else {
          setGpuUtilization(85 + Math.sin(elapsed / 200) * 5)
        }
      } else {
        // Without Triton, GPU utilization is lower and fluctuates
        setGpuUtilization(25 + Math.sin(elapsed / 300) * 10)
      }

      // Update total time
      setTotalTime(elapsed)

      // Continue animation if not complete
      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsRunning(false)
        setIsComplete(true)
        setTotalTime(useTriton ? 3000 : 5000)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold mb-4 text-black">Request Queue Visualization</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-5 w-5 text-slate-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    Triton groups multiple requests into batches to maximize GPU utilization and reduce overall
                    processing time.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 h-80">
            <RequestQueueVisualizer
              batchSize={batchSize}
              isRunning={isRunning}
              isTritonEnabled={isTritonEnabled}
              progress={progress}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Batch Size</h3>
              <span className="text-sm font-medium">{batchSize}</span>
            </div>

            <div className="mb-6">
              <Slider
                defaultValue={[8]}
                max={32}
                min={1}
                step={1}
                onValueChange={handleBatchSizeChange}
                disabled={isRunning}
              />
              <div className="flex justify-between text-sm mt-2">
                <span>1</span>
                <span>16</span>
                <span>32</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold">Batch Size: {batchSize}</span>
                </div>
                <span className="text-sm text-slate-600">
                  {batchSize < 4
                    ? "Small batches, lower throughput"
                    : batchSize < 16
                      ? "Balanced batches, good throughput"
                      : "Large batches, high throughput"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => runSimulation(false)}
              variant="outline"
              className="flex-1"
              size="lg"
              disabled={isRunning}
            >
              <Server className="mr-2 h-4 w-4" />
              Run Without Batching
            </Button>

            <Button onClick={() => runSimulation(true)} className="flex-1" size="lg" disabled={isRunning}>
              <Zap className="mr-2 h-4 w-4" />
              Run with Triton
            </Button>
          </div>

          {isRunning && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium">Processing Progress</h4>
                  <span className="text-sm">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium">GPU Utilization</h4>
                  <span className="text-sm">{Math.round(gpuUtilization)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${gpuUtilization}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Elapsed Time</h4>
                <span className="text-xl font-bold">{(totalTime / 1000).toFixed(1)}s</span>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-sm text-slate-500 mb-1">Total Time</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{(totalTime / 1000).toFixed(1)}s</span>
                    {isTritonEnabled && <span className="text-sm text-green-600 font-medium">(58% faster)</span>}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-sm text-slate-500 mb-1">GPU Efficiency</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{Math.round(gpuUtilization)}%</span>
                    {isTritonEnabled && <span className="text-sm text-green-600 font-medium">(3.4x better)</span>}
                  </div>
                </div>
              </div>

              <Button onClick={onComplete} variant="outline" className="w-full">
                Continue to Image Classification Demo
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold mb-2 text-black">What is Triton Inference Server?</h3>
        <p className="text-slate-600">
          Triton Inference Server is a high-performance system for deploying AI models at scale. It excels at batching
          multiple inference requests together, which maximizes GPU utilization and dramatically improves throughput for
          production workloads.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded border border-slate-200">
            <h4 className="font-medium mb-1">Dynamic Batching</h4>
            <p className="text-sm text-slate-600">Automatically combines requests to maximize GPU usage</p>
          </div>
          <div className="bg-white p-3 rounded border border-slate-200">
            <h4 className="font-medium mb-1">Concurrent Model Execution</h4>
            <p className="text-sm text-slate-600">Runs multiple models efficiently on the same hardware</p>
          </div>
          <div className="bg-white p-3 rounded border border-slate-200">
            <h4 className="font-medium mb-1">Scalable Architecture</h4>
            <p className="text-sm text-slate-600">Handles thousands of concurrent requests with low latency</p>
          </div>
        </div>
      </div>
    </div>
  )
}

