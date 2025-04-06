"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon, Upload, BarChart2, Zap } from "lucide-react"
import ImageUploader from "./image-uploader"
import ResultsPanel from "./results-panel"
import PerformanceMetrics from "./performance-metrics"
import { runInference } from "@/lib/inference"
import type { PrecisionMode, InferenceResult } from "@/lib/types"

export default function ImageClassifier() {
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    baseline: InferenceResult | null
    optimized: InferenceResult | null
  }>({
    baseline: null,
    optimized: null,
  })
  const [precisionMode, setPrecisionMode] = useState<PrecisionMode>("FP32")
  const [dynamicBatching, setDynamicBatching] = useState(true)
  const [activeTab, setActiveTab] = useState("upload")
  const [stressTestResults, setStressTestResults] = useState<{
    baseline: InferenceResult[]
    optimized: InferenceResult[]
  }>({
    baseline: [],
    optimized: [],
  })

  const handleImageUpload = (imageDataUrl: string) => {
    setImage(imageDataUrl)
    setResults({ baseline: null, optimized: null })
    setActiveTab("results")
    processImage(imageDataUrl)
  }

  const processImage = async (imageDataUrl: string) => {
    setIsLoading(true)

    try {
      // Run inference on both models
      const baselineResult = await runInference(imageDataUrl, "baseline", precisionMode, dynamicBatching)

      const optimizedResult = await runInference(imageDataUrl, "optimized", precisionMode, dynamicBatching)

      setResults({
        baseline: baselineResult,
        optimized: optimizedResult,
      })
    } catch (error) {
      console.error("Error processing image:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const runStressTest = async () => {
    setIsLoading(true)
    setActiveTab("metrics")

    try {
      const baselineResults: InferenceResult[] = []
      const optimizedResults: InferenceResult[] = []

      // Simulate 50 parallel requests
      const requests = 50
      const baselinePromises = []
      const optimizedPromises = []

      for (let i = 0; i < requests; i++) {
        if (image) {
          baselinePromises.push(runInference(image, "baseline", precisionMode, dynamicBatching, true))
          optimizedPromises.push(runInference(image, "optimized", precisionMode, dynamicBatching, true))
        }
      }

      const baselineResponses = await Promise.all(baselinePromises)
      const optimizedResponses = await Promise.all(optimizedPromises)

      setStressTestResults({
        baseline: baselineResponses,
        optimized: optimizedResponses,
      })
    } catch (error) {
      console.error("Error running stress test:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Model Configuration</h2>
              <p className="text-muted-foreground">Adjust settings to compare different optimization techniques</p>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="precision-mode"
                  checked={precisionMode === "FP16"}
                  onCheckedChange={(checked) => setPrecisionMode(checked ? "FP16" : "FP32")}
                />
                <Label htmlFor="precision-mode">FP16 Precision</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        FP16 (half precision) reduces memory usage and computation time with minimal accuracy loss
                        compared to FP32 (full precision).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="dynamic-batching" checked={dynamicBatching} onCheckedChange={setDynamicBatching} />
                <Label htmlFor="dynamic-batching">Dynamic Batching</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        Dynamic batching allows Triton to combine multiple inference requests into a single batch,
                        improving throughput under high load.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </TabsTrigger>
              <TabsTrigger value="results">
                <Zap className="h-4 w-4 mr-2" />
                Results
              </TabsTrigger>
              <TabsTrigger value="metrics">
                <BarChart2 className="h-4 w-4 mr-2" />
                Performance Metrics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <ImageUploader onImageUpload={handleImageUpload} />
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <ResultsPanel image={image} results={results} isLoading={isLoading} precisionMode={precisionMode} />

              <div className="mt-6 flex justify-center">
                <Button onClick={runStressTest} disabled={!image || isLoading} variant="secondary" size="lg">
                  Run Stress Test (50 Parallel Requests)
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="mt-6">
              <PerformanceMetrics
                stressTestResults={stressTestResults}
                precisionMode={precisionMode}
                dynamicBatching={dynamicBatching}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

