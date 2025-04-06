"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

// Sample images and their hardcoded results
const sampleImages = [
  {
    id: "dog",
    name: "Labrador",
    url: "/images/dog.png",
    baselineResults: {
      prediction: "Labrador",
      confidence: 94,
      latency: 200,
    },
    optimizedResults: {
      prediction: "Labrador",
      confidence: 92,
      latency: 80,
    },
  },
  {
    id: "cat",
    name: "Tabby Cat",
    url: "/images/cat.png",
    baselineResults: {
      prediction: "Tabby Cat",
      confidence: 91,
      latency: 210,
    },
    optimizedResults: {
      prediction: "Tabby Cat",
      confidence: 90,
      latency: 85,
    },
  },
  {
    id: "car",
    name: "Sports Car",
    url: "/images/car.png",
    baselineResults: {
      prediction: "Sports Car",
      confidence: 96,
      latency: 190,
    },
    optimizedResults: {
      prediction: "Sports Car",
      confidence: 95,
      latency: 75,
    },
  },
]

export default function ImageClassificationDemo() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{
    baseline: { prediction: string; confidence: number; latency: number } | null
    optimized: { prediction: string; confidence: number; latency: number } | null
  }>({
    baseline: null,
    optimized: null,
  })

  const handleImageSelect = (imageId: string) => {
    setSelectedImage(imageId)
    setResults({ baseline: null, optimized: null })
  }

  const handleProcess = () => {
    if (!selectedImage || isProcessing) return

    setIsProcessing(true)
    setProgress(0)

    // Simulate processing with a progress bar
    const duration = 3000 // 3 seconds
    const interval = 50 // Update every 50ms
    const steps = duration / interval
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      setProgress(Math.floor((currentStep / steps) * 100))

      if (currentStep >= steps) {
        clearInterval(timer)
        setIsProcessing(false)

        // Set results based on the selected image
        const imageData = sampleImages.find((img) => img.id === selectedImage)
        if (imageData) {
          setResults({
            baseline: imageData.baselineResults,
            optimized: imageData.optimizedResults,
          })
        }
      }
    }, interval)
  }

  const selectedImageData = sampleImages.find((img) => img.id === selectedImage)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleImages.map((image) => (
          <div
            key={image.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all
              ${selectedImage === image.id ? "border-purple-500 bg-purple-50" : "border-slate-200 hover:border-purple-300"}
            `}
            onClick={() => handleImageSelect(image.id)}
          >
            <div className="aspect-square mb-2 bg-white rounded overflow-hidden">
              <img src={image.url || "/placeholder.svg"} alt={image.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-center font-medium">{image.name}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={handleProcess} disabled={!selectedImage || isProcessing} size="lg">
          {isProcessing ? "Processing..." : "Process Image"}
        </Button>
      </div>

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Processing Image</span>
            <span className="text-sm">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {results.baseline && results.optimized && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 p-3 flex items-center justify-between">
              <h3 className="font-medium">Baseline (PyTorch)</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Standard PyTorch model running without optimizations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="p-4">
              <div className="aspect-square max-h-48 mx-auto mb-4">
                {selectedImageData && (
                  <img
                    src={selectedImageData.url || "/placeholder.svg"}
                    alt={selectedImageData.name}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Prediction</p>
                  <p className="text-xl font-bold">{results.baseline.prediction}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Confidence</p>
                  <p className="text-xl font-bold">{results.baseline.confidence}%</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Latency</p>
                  <p className="text-xl font-bold">{results.baseline.latency} ms</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-green-200 rounded-lg overflow-hidden bg-green-50">
            <div className="bg-green-100 p-3 flex items-center justify-between">
              <h3 className="font-medium text-green-800">Optimized (TensorRT + Triton)</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-800">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>TensorRT-optimized model served via Triton Inference Server with dynamic batching</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="p-4">
              <div className="aspect-square max-h-48 mx-auto mb-4">
                {selectedImageData && (
                  <img
                    src={selectedImageData.url || "/placeholder.svg"}
                    alt={selectedImageData.name}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-green-700 mb-1">Prediction</p>
                  <p className="text-xl font-bold text-green-800">{results.optimized.prediction}</p>
                </div>

                <div>
                  <p className="text-sm text-green-700 mb-1">Confidence</p>
                  <p className="text-xl font-bold text-green-800">
                    {results.optimized.confidence}%
                    <span className="text-sm font-normal ml-2">
                      (
                      {results.baseline.confidence - results.optimized.confidence > 0
                        ? `-${results.baseline.confidence - results.optimized.confidence}%`
                        : "No change"}
                      )
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-green-700 mb-1">Latency</p>
                  <p className="text-xl font-bold text-green-800">
                    {results.optimized.latency} ms
                    <span className="text-sm font-normal ml-2 text-green-600">
                      (
                      {Math.round(
                        ((results.baseline.latency - results.optimized.latency) / results.baseline.latency) * 100,
                      )}
                      % faster)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold mb-2 text-black">Key Takeaways</h3>
        <ul className="space-y-2 text-slate-600">
          <li className="flex items-start">
            <span className="text-black-500 mr-2">1.</span>
            <span>TensorRT + Triton typically reduces inference latency by 50-60% with minimal accuracy impact</span>
          </li>
          <li className="flex items-start">
            <span className="text-black-500 mr-2">2.</span>
            <span>Lower precision (FP16/INT8) trades a small amount of accuracy for significant speed gains</span>
          </li>
          <li className="flex items-start">
            <span className="text-black-500 mr-2">3.</span>
            <span>Dynamic batching dramatically improves throughput for high-volume inference workloads</span>
          </li>
          <li className="flex items-start">
            <span className="text-black-500 mr-2">4.</span>
            <span>These optimizations are essential for production AI systems serving many users</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

