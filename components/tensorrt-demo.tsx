"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon, Zap } from "lucide-react"
import NeuralNetworkVisualizer from "./neural-network-visualizer"

interface TensorRTDemoProps {
  onComplete: () => void
}

export default function TensorRTDemo({ onComplete }: TensorRTDemoProps) {
  const [isOptimized, setIsOptimized] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [precision, setPrecision] = useState(32) // 32, 16, or 8
  const [progress, setProgress] = useState(0)
  const [optimizationStep, setOptimizationStep] = useState("")
  const [latency, setLatency] = useState(150)
  const [accuracy, setAccuracy] = useState(95)

  const handleOptimize = () => {
    if (isOptimizing) return

    setIsOptimizing(true)
    setProgress(0)
    setOptimizationStep("Analyzing model structure...")

    // Simulate optimization process
    const totalSteps = 5
    const stepTime = 600

    const steps = [
      "Analyzing model structure...",
      "Fusing layers...",
      "Optimizing kernels...",
      `Calibrating for ${precision === 8 ? "INT8" : precision === 16 ? "FP16" : "FP32"}...`,
      "Generating optimized engine...",
    ]

    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      setProgress(Math.floor((currentStep / totalSteps) * 100))

      if (currentStep < totalSteps) {
        setOptimizationStep(steps[currentStep])
      } else {
        clearInterval(interval)
        setIsOptimizing(false)
        setIsOptimized(true)

        // Calculate new latency and accuracy based on precision
        if (precision === 32) {
          setLatency(120)
          setAccuracy(95)
        } else if (precision === 16) {
          setLatency(90)
          setAccuracy(94)
        } else {
          setLatency(70)
          setAccuracy(93)
        }
      }
    }, stepTime)
  }

  const handlePrecisionChange = (value: number[]) => {
    const precisionValue = value[0]
    if (precisionValue <= 16) {
      setPrecision(8)
    } else if (precisionValue <= 24) {
      setPrecision(16)
    } else {
      setPrecision(32)
    }

    setIsOptimized(false)
  }

  const getPrecisionLabel = () => {
    if (precision === 8) return "INT8"
    if (precision === 16) return "FP16"
    return "FP32"
  }

  const getPrecisionDescription = () => {
    if (precision === 8) return "2x faster, small accuracy trade-off"
    if (precision === 16) return "1.5x faster, minimal accuracy impact"
    return "Baseline precision, highest accuracy"
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-black">Neural Network Visualization</h3>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 h-80 flex items-center justify-center">
            <NeuralNetworkVisualizer isOptimized={isOptimized} precision={precision} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-black">Precision Setting</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-5 w-5 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      Lower precision (FP16, INT8) reduces model size and speeds up inference, sometimes with a small
                      accuracy trade-off.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="mb-6">
              <Slider
                defaultValue={[32]}
                max={32}
                min={8}
                step={8}
                onValueChange={handlePrecisionChange}
                disabled={isOptimizing}
              />
              <div className="flex justify-between text-sm mt-2">
                <span>INT8</span>
                <span>FP16</span>
                <span>FP32</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold">{getPrecisionLabel()}</span>
                  <span className="text-sm text-slate-500 ml-2">({precision}-bit)</span>
                </div>
                <span className="text-sm text-slate-600">{getPrecisionDescription()}</span>
              </div>
            </div>
          </div>

          {isOptimizing ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Optimization Progress</h3>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-slate-600">{optimizationStep}</p>
            </div>
          ) : (
            <Button onClick={handleOptimize} className="w-full" size="lg" disabled={isOptimized}>
              <Zap className="mr-2 h-4 w-4" />
              {isOptimized ? "Model Optimized!" : "Optimize with TensorRT"}
            </Button>
          )}

          {isOptimized && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-sm text-slate-500 mb-1">Latency</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{latency}ms</span>
                    <span className="text-sm text-green-600 font-medium">
                      ({Math.round(((150 - latency) / 150) * 100)}% faster)
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-sm text-slate-500 mb-1">Accuracy</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{accuracy}%</span>
                    <span className="text-sm text-slate-600 font-medium">
                      ({95 - accuracy > 0 ? `-${95 - accuracy}%` : "No change"})
                    </span>
                  </div>
                </div>
              </div>

              <Button onClick={onComplete} variant="outline" className="w-full">
                Continue to Triton Demo
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold mb-2 text-black">What is TensorRT?</h3>
        <p className="text-slate-600">
          TensorRT is an SDK for high-performance deep learning inference that optimizes neural networks for production
          deployment. It applies techniques like layer fusion, precision calibration, and kernel auto-tuning to
          dramatically reduce latency and memory usage while preserving accuracy.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded border border-slate-200">
            <h4 className="font-medium mb-1">Layer Fusion</h4>
            <p className="text-sm text-slate-600">Combines multiple operations into a single optimized kernel</p>
          </div>
          <div className="bg-white p-3 rounded border border-slate-200">
            <h4 className="font-medium mb-1">Precision Calibration</h4>
            <p className="text-sm text-slate-600">Reduces numerical precision while preserving accuracy</p>
          </div>
          <div className="bg-white p-3 rounded border border-slate-200">
            <h4 className="font-medium mb-1">Kernel Optimization</h4>
            <p className="text-sm text-slate-600">Selects the most efficient CUDA implementation for each operation</p>
          </div>
        </div>
      </div>
    </div>
  )
}

