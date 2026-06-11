"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  { emoji: "📍", label: "Mencari lokasi...", duration: 2000 },
  { emoji: "🔍", label: "Memindai usaha sekitar...", duration: 3000 },
  { emoji: "🧠", label: "Menganalisis kompetitor...", duration: 3000 },
  { emoji: "📊", label: "Menyusun rekomendasi...", duration: 2000 },
]

export default function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const total = steps.reduce((a, s) => a + s.duration, 0)
    const start = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min((elapsed / total) * 100, 100)
      setProgress(pct)

      let cumulative = 0
      for (let i = 0; i < steps.length; i++) {
        cumulative += steps[i].duration
        if (elapsed < cumulative) {
          setCurrentStep(i)
          break
        }
      }
      if (elapsed >= total) {
        setCurrentStep(steps.length - 1)
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <div className="w-full h-[450px] rounded-lg border bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">{steps[currentStep].emoji}</div>
            <p className="text-lg font-medium text-gray-700">{steps[currentStep].label}</p>
            <div className="w-64 mx-auto bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700 mb-3">Proses:</p>
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-all ${
                i === currentStep
                  ? "bg-blue-50 text-blue-700 font-medium scale-105"
                  : i < currentStep
                    ? "text-green-600"
                    : "text-gray-400"
              }`}
            >
              <span>{i < currentStep ? "✅" : i === currentStep ? "⏳" : s.emoji}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
