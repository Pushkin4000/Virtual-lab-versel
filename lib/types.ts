export type ModelType = "baseline" | "optimized"
export type PrecisionMode = "FP32" | "FP16"

export interface InferenceResult {
  prediction: string
  confidence: number
  latency_ms: number
  throughput_rps: number
  gpu_utilization: number
}

