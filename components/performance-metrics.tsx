"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { InferenceResult, PrecisionMode } from "@/lib/types"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Colors)

interface PerformanceMetricsProps {
  stressTestResults: {
    baseline: InferenceResult[]
    optimized: InferenceResult[]
  }
  precisionMode: PrecisionMode
  dynamicBatching: boolean
}

export default function PerformanceMetrics({
  stressTestResults,
  precisionMode,
  dynamicBatching,
}: PerformanceMetricsProps) {
  const [activeTab, setActiveTab] = useState("latency")

  // Calculate percentiles for latency
  const calculatePercentiles = (results: InferenceResult[]) => {
    if (!results.length) return { p50: 0, p90: 0, p99: 0 }

    const latencies = [...results].sort((a, b) => a.latency_ms - b.latency_ms)
    const p50Index = Math.floor(latencies.length * 0.5)
    const p90Index = Math.floor(latencies.length * 0.9)
    const p99Index = Math.floor(latencies.length * 0.99)

    return {
      p50: latencies[p50Index]?.latency_ms || 0,
      p90: latencies[p90Index]?.latency_ms || 0,
      p99: latencies[p99Index]?.latency_ms || 0,
    }
  }

  const baselinePercentiles = calculatePercentiles(stressTestResults.baseline)
  const optimizedPercentiles = calculatePercentiles(stressTestResults.optimized)

  // Calculate average throughput
  const calculateAvgThroughput = (results: InferenceResult[]) => {
    if (!results.length) return 0
    return results.reduce((sum, result) => sum + result.throughput_rps, 0) / results.length
  }

  const baselineAvgThroughput = calculateAvgThroughput(stressTestResults.baseline)
  const optimizedAvgThroughput = calculateAvgThroughput(stressTestResults.optimized)

  // Prepare data for latency distribution chart
  const latencyDistributionData = {
    labels: ["p50", "p90", "p99"],
    datasets: [
      {
        label: "Baseline (PyTorch)",
        data: [baselinePercentiles.p50, baselinePercentiles.p90, baselinePercentiles.p99],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Optimized (TensorRT + Triton)",
        data: [optimizedPercentiles.p50, optimizedPercentiles.p90, optimizedPercentiles.p99],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  // Prepare data for throughput chart
  const throughputData = {
    labels: ["Average Throughput (requests/second)"],
    datasets: [
      {
        label: "Baseline (PyTorch)",
        data: [baselineAvgThroughput],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Optimized (TensorRT + Triton)",
        data: [optimizedAvgThroughput],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  // Prepare data for latency over time chart
  const latencyTimeData = {
    labels: stressTestResults.baseline.map((_, i) => `Request ${i + 1}`),
    datasets: [
      {
        label: "Baseline (PyTorch)",
        data: stressTestResults.baseline.map((result) => result.latency_ms),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Optimized (TensorRT + Triton)",
        data: stressTestResults.optimized.map((result) => result.latency_ms),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  if (!stressTestResults.baseline.length && !stressTestResults.optimized.length) {
    return (
      <div className="text-center p-12">
        <p className="text-muted-foreground">Run a stress test to see performance metrics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Latency Improvement</h3>
            <p className="text-3xl font-bold text-green-600">
              {baselinePercentiles.p50 && optimizedPercentiles.p50
                ? ((1 - optimizedPercentiles.p50 / baselinePercentiles.p50) * 100).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-sm text-muted-foreground">
              Median latency reduction from {baselinePercentiles.p50.toFixed(1)}ms to{" "}
              {optimizedPercentiles.p50.toFixed(1)}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Throughput Improvement</h3>
            <p className="text-3xl font-bold text-blue-600">
              {baselineAvgThroughput && optimizedAvgThroughput
                ? ((optimizedAvgThroughput / baselineAvgThroughput - 1) * 100).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-sm text-muted-foreground">
              Average throughput increase from {baselineAvgThroughput.toFixed(1)} to {optimizedAvgThroughput.toFixed(1)}{" "}
              req/s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Configuration</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precision Mode:</span>
                <span className="font-medium">{precisionMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dynamic Batching:</span>
                <span className="font-medium">{dynamicBatching ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requests:</span>
                <span className="font-medium">{stressTestResults.baseline.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="latency">Latency Distribution</TabsTrigger>
              <TabsTrigger value="throughput">Throughput</TabsTrigger>
              <TabsTrigger value="timeline">Latency Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="latency" className="h-80">
              <Bar
                data={latencyDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: "Latency Percentiles (ms)",
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)} ms`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: "Latency (ms)",
                      },
                    },
                  },
                }}
              />
            </TabsContent>

            <TabsContent value="throughput" className="h-80">
              <Bar
                data={throughputData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: "y",
                  plugins: {
                    title: {
                      display: true,
                      text: "Average Throughput (requests/second)",
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.parsed.x.toFixed(1)} req/s`,
                      },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Requests per second",
                      },
                    },
                  },
                }}
              />
            </TabsContent>

            <TabsContent value="timeline" className="h-80">
              <Line
                data={latencyTimeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: "Latency Over Time",
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)} ms`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: "Latency (ms)",
                      },
                    },
                    x: {
                      ticks: {
                        maxTicksLimit: 10,
                      },
                    },
                  },
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Educational Insights</h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Why TensorRT Optimizes Models</h4>
              <p className="text-muted-foreground">TensorRT applies several optimizations to neural networks:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium">Layer Fusion</span>: Combines multiple layers into a single optimized
                  layer
                </li>
                <li>
                  <span className="font-medium">Precision Calibration</span>: Converts FP32 to FP16 or INT8 with minimal
                  accuracy loss
                </li>
                <li>
                  <span className="font-medium">Kernel Auto-tuning</span>: Selects the most efficient CUDA kernels for
                  your GPU
                </li>
                <li>
                  <span className="font-medium">Dynamic Tensor Memory</span>: Optimizes memory allocation during
                  inference
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">How Triton Improves Throughput</h4>
              <p className="text-muted-foreground">Triton Inference Server enhances model serving with:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium">Dynamic Batching</span>: Automatically combines incoming requests to
                  maximize GPU utilization
                </li>
                <li>
                  <span className="font-medium">Concurrent Model Execution</span>: Runs multiple models simultaneously
                  on the same GPU
                </li>
                <li>
                  <span className="font-medium">Instance Groups</span>: Creates multiple instances of the same model for
                  parallel processing
                </li>
                <li>
                  <span className="font-medium">Request Scheduling</span>: Prioritizes and manages inference requests
                  efficiently
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">When to Use These Optimizations</h4>
              <p className="text-muted-foreground">Consider these optimizations for:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium">High-throughput Applications</span>: When serving many concurrent users
                </li>
                <li>
                  <span className="font-medium">Latency-sensitive Services</span>: When response time is critical
                </li>
                <li>
                  <span className="font-medium">Resource-constrained Environments</span>: To maximize hardware
                  utilization
                </li>
                <li>
                  <span className="font-medium">Production Deployments</span>: When moving from development to
                  production
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

