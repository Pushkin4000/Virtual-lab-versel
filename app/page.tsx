import type { Metadata } from "next"
import OptimizationGame from "@/components/optimization-game"

export const metadata: Metadata = {
  title: "Speed vs. Accuracy: The AI Optimization Game",
  description: "Learn how TensorRT and Triton Inference Server optimize AI models",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-black">Speed vs. Accuracy: The AI Optimization Game</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover how TensorRT and Triton Inference Server accelerate AI models through visual comparisons and
            interactive demos
          </p>
        </header>

        <OptimizationGame />
      </div>
    </main>
  )
}

