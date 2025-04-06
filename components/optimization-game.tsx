"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import TensorRTDemo from "./tensorrt-demo"
import TritonDemo from "./triton-demo"
import ImageClassificationDemo from "./image-classification-demo"
import ComparisonTable from "./comparison-table"

export default function OptimizationGame() {
  const [activeTab, setActiveTab] = useState("tensorrt")

  return (
    <div className="space-y-8">
      <Tabs defaultValue="tensorrt" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tensorrt" className="text-sm sm:text-base">
            <span className="hidden sm:inline">1. </span>Optimize Your Model
          </TabsTrigger>
          <TabsTrigger value="triton" className="text-sm sm:text-base">
            <span className="hidden sm:inline">2. </span>Batch Requests
          </TabsTrigger>
          <TabsTrigger value="classification" className="text-sm sm:text-base">
            <span className="hidden sm:inline">3. </span>Try It Yourself
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tensorrt" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-black">Optimize Your Model with TensorRT</h2>
              <p className="text-slate-600 mb-6">
                TensorRT accelerates inference by optimizing your neural network through layer fusion, precision
                calibration, and kernel optimization.
              </p>
              <TensorRTDemo onComplete={() => setActiveTab("triton")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triton" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-black">Batch Requests with Triton</h2>
              <p className="text-slate-600 mb-6">
                Triton Inference Server improves throughput by intelligently batching multiple requests together,
                maximizing GPU utilization.
              </p>
              <TritonDemo onComplete={() => setActiveTab("classification")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classification" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-black">Try It Yourself: Image Classification</h2>
              <p className="text-slate-600 mb-6">
                See the combined power of TensorRT and Triton in action with this image classification demo.
              </p>
              <ImageClassificationDemo />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-black">Performance Comparison</h2>
          <ComparisonTable />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-black">Optimization Pipeline</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-md max-w-md">
              <h3 className="text-lg font-semibold mb-2 text-red-500">Before Optimization</h3>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <div className="h-12 w-12 mx-auto flex items-center justify-center bg-red-100 rounded-full">
                    <span className="text-red-500 font-bold">U</span>
                  </div>
                  <span className="text-sm">User</span>
                </div>
                <div className="text-red-500">→</div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <div className="h-12 w-12 mx-auto flex items-center justify-center bg-red-100 rounded-full">
                    <span className="text-red-500 font-bold">M</span>
                  </div>
                  <span className="text-sm">Slow Model</span>
                </div>
                <div className="text-red-500">→</div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <div className="h-12 w-12 mx-auto flex items-center justify-center bg-red-100 rounded-full">
                    <span className="text-red-500 font-bold">R</span>
                  </div>
                  <span className="text-sm">Slow Results</span>
                </div>
              </div>
              <div className="mt-4 text-center text-red-500">
                <span className="font-bold">200ms</span> inference time
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md max-w-md">
              <h3 className="text-lg font-semibold mb-2 text-green-500">After Optimization</h3>
              <div className="flex items-center justify-center gap-2">
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="h-12 w-12 mx-auto flex items-center justify-center bg-green-100 rounded-full">
                    <span className="text-green-500 font-bold">U</span>
                  </div>
                  <span className="text-sm">User</span>
                </div>
                <div className="text-green-500">→</div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="h-12 w-12 mx-auto flex items-center justify-center bg-green-100 rounded-full">
                    <span className="text-green-500 font-bold">T</span>
                  </div>
                  <span className="text-xs">Triton</span>
                </div>
                <div className="text-green-500">→</div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="h-12 w-12 mx-auto flex items-center justify-center bg-green-100 rounded-full">
                    <span className="text-green-500 font-bold">TR</span>
                  </div>
                  <span className="text-xs">TensorRT</span>
                </div>
                <div className="text-green-500">→</div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="h-12 w-12 mx-auto flex items-center justify-center bg-green-100 rounded-full">
                    <span className="text-green-500 font-bold">R</span>
                  </div>
                  <span className="text-sm">Fast Results</span>
                </div>
              </div>
              <div className="mt-4 text-center text-green-500">
                <span className="font-bold">80ms</span> inference time (<span className="font-bold">2.5x</span> faster!)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

