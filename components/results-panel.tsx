"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { InferenceResult, PrecisionMode } from "@/lib/types"
import { Cpu, Zap } from "lucide-react"

interface ResultsPanelProps {
  image: string | null
  results: {
    baseline: InferenceResult | null
    optimized: InferenceResult | null
  }
  isLoading: boolean
  precisionMode: PrecisionMode
}

export default function ResultsPanel({ image, results, isLoading, precisionMode }: ResultsPanelProps) {
  if (!image) {
    return (
      <div className="text-center p-12">
        <p className="text-muted-foreground">Upload an image to see classification results</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Baseline Model Results */}
      <Card className="overflow-hidden">
        <div className="bg-slate-100 p-3 flex items-center justify-between">
          <div className="flex items-center">
            <Cpu className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Baseline Model (PyTorch)</h3>
          </div>
          <Badge variant="outline">{precisionMode}</Badge>
        </div>
        <CardContent className="p-6">
          <div className="aspect-square max-h-64 mx-auto mb-4 relative">
            <img src={image || "/placeholder.svg"} alt="Uploaded" className="object-contain w-full h-full rounded-md" />

            {results.baseline && !isLoading && (
              <div className="absolute top-2 left-2 right-2 bg-black/70 text-white p-2 rounded-md text-sm">
                <p className="font-medium">{results.baseline.prediction}</p>
                <p>Confidence: {(results.baseline.confidence * 100).toFixed(1)}%</p>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : results.baseline ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Latency</p>
                <div className="flex items-center">
                  <div className="w-full bg-slate-200 rounded-full h-4">
                    <div className="bg-orange-500 h-4 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                  <span className="ml-2 font-medium">{results.baseline.latency_ms.toFixed(1)} ms</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Throughput</p>
                <div className="flex items-center">
                  <div className="w-full bg-slate-200 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                  <span className="ml-2 font-medium">{results.baseline.throughput_rps.toFixed(1)} req/s</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">GPU Utilization</p>
                <div className="flex items-center">
                  <div className="w-full bg-slate-200 rounded-full h-4">
                    <div
                      className="bg-purple-500 h-4 rounded-full"
                      style={{ width: `${results.baseline.gpu_utilization}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium">{results.baseline.gpu_utilization}%</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No results yet</p>
          )}
        </CardContent>
      </Card>

      {/* Optimized Model Results */}
      <Card className="overflow-hidden">
        <div className="bg-slate-100 p-3 flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Optimized Model (TensorRT + Triton)</h3>
          </div>
          <Badge variant="outline">{precisionMode}</Badge>
        </div>
        <CardContent className="p-6">
          <div className="aspect-square max-h-64 mx-auto mb-4 relative">
            <img src={image || "/placeholder.svg"} alt="Uploaded" className="object-contain w-full h-full rounded-md" />

            {results.optimized && !isLoading && (
              <div className="absolute top-2 left-2 right-2 bg-black/70 text-white p-2 rounded-md text-sm">
                <p className="font-medium">{results.optimized.prediction}</p>
                <p>Confidence: {(results.optimized.confidence * 100).toFixed(1)}%</p>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : results.optimized ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Latency</p>
                <div className="flex items-center">
                  <div className="w-full bg-slate-200 rounded-full h-4">
                    <div
                      className="bg-orange-500 h-4 rounded-full"
                      style={{
                        width: `${(results.optimized.latency_ms / results.baseline!.latency_ms) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium">{results.optimized.latency_ms.toFixed(1)} ms</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Throughput</p>
                <div className="flex items-center">
                  <div className="w-full bg-slate-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{
                        width: `${(results.optimized.throughput_rps / results.baseline!.throughput_rps) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium">{results.optimized.throughput_rps.toFixed(1)} req/s</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">GPU Utilization</p>
                <div className="flex items-center">
                  <div className="w-full bg-slate-200 rounded-full h-4">
                    <div
                      className="bg-purple-500 h-4 rounded-full"
                      style={{ width: `${results.optimized.gpu_utilization}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium">{results.optimized.gpu_utilization}%</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No results yet</p>
          )}
        </CardContent>
      </Card>

      {/* Comparison Summary */}
      {results.baseline && results.optimized && !isLoading && (
        <Card className="md:col-span-2 mt-4">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Performance Comparison</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Latency Improvement</p>
                <p className="text-2xl font-bold text-green-600">
                  {((1 - results.optimized.latency_ms / results.baseline.latency_ms) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {results.baseline.latency_ms.toFixed(1)}ms → {results.optimized.latency_ms.toFixed(1)}ms
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Throughput Improvement</p>
                <p className="text-2xl font-bold text-blue-600">
                  {((results.optimized.throughput_rps / results.baseline.throughput_rps - 1) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {results.baseline.throughput_rps.toFixed(1)} → {results.optimized.throughput_rps.toFixed(1)} req/s
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Accuracy Difference</p>
                <p className="text-2xl font-bold text-purple-600">
                  {((results.optimized.confidence / results.baseline.confidence - 1) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(results.baseline.confidence * 100).toFixed(1)}% → {(results.optimized.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

