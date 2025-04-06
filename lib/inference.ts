import type { ModelType, PrecisionMode, InferenceResult } from "./types"

// ImageNet class labels (top 10 for demo)
const IMAGENET_CLASSES = [
  "goldfish",
  "great white shark",
  "tiger shark",
  "hammerhead shark",
  "electric ray",
  "stingray",
  "rooster",
  "hen",
  "ostrich",
  "brambling",
]

// Simulated inference function
export async function runInference(
  imageDataUrl: string,
  modelType: ModelType,
  precisionMode: PrecisionMode,
  dynamicBatching: boolean,
  isStressTest = false,
): Promise<InferenceResult> {
  // Simulate network latency and processing time
  const baseLatency = modelType === "baseline" ? 120 : 45
  const precisionFactor = precisionMode === "FP16" ? 0.7 : 1.0
  const batchingFactor = dynamicBatching && modelType === "optimized" ? 0.8 : 1.0

  // Add some randomness to make it realistic
  const randomFactor = 0.8 + Math.random() * 0.4

  // Calculate final latency
  let latency = baseLatency * precisionFactor * batchingFactor * randomFactor

  // For stress test, simulate batching effects
  if (isStressTest && modelType === "optimized" && dynamicBatching) {
    // Optimized model with dynamic batching handles stress better
    latency = latency * (0.7 + Math.random() * 0.3)
  } else if (isStressTest) {
    // Non-optimized or without batching struggles under load
    latency = latency * (1.2 + Math.random() * 0.6)
  }

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, Math.min(500, latency)))

  // Calculate throughput (inverse of latency with some scaling)
  const throughput =
    modelType === "baseline" ? 1000 / (baseLatency * randomFactor) : 1000 / (baseLatency * 0.4 * randomFactor)

  // Simulate GPU utilization
  const gpuUtilization =
    modelType === "baseline" ? Math.floor(70 + Math.random() * 20) : Math.floor(40 + Math.random() * 30)

  // Randomly select a class and confidence
  const classIndex = Math.floor(Math.random() * IMAGENET_CLASSES.length)
  const prediction = IMAGENET_CLASSES[classIndex]

  // Simulate slightly different confidence for optimized model
  let confidence
  if (modelType === "baseline") {
    confidence = 0.85 + Math.random() * 0.1
  } else {
    // FP16 might have slightly lower confidence
    confidence = precisionMode === "FP16" ? 0.83 + Math.random() * 0.1 : 0.84 + Math.random() * 0.1
  }

  return {
    prediction,
    confidence,
    latency_ms: latency,
    throughput_rps: throughput,
    gpu_utilization: gpuUtilization,
  }
}

