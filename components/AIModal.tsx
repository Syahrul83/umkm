"use client"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlaceData } from "@/types"

interface AIModalProps {
  location: string
  places: PlaceData[]
}

const steps = [
  { emoji: "🧠", label: "Menganalisis pertanyaan..." },
  { emoji: "📊", label: "Mencocokkan data usaha..." },
  { emoji: "💡", label: "Menyusun rekomendasi..." },
]

export default function AIModal({ location, places }: AIModalProps) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  async function handleAsk() {
    setLoading(true)
    setAnswer("")
    setCurrentStep(0)

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }, 2500)

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, location, places }),
    })
    const data = await res.json()
    setAnswer(data.answer)
    setLoading(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-5" />}>
        <span className="material-symbols-outlined text-[18px]">forum</span>
        Tanya AI
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tanya AI tentang lokasi ini</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Contoh: modal 10 juta cocok buka apa?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleAsk()}
          />
          <Button onClick={handleAsk} disabled={loading || !question} className="w-full">
            {loading ? "Memproses..." : "Tanya"}
          </Button>

          {loading && (
            <div className="bg-blue-50 rounded-lg p-3 space-y-2 border border-blue-100">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-sm transition-all ${
                    i === currentStep
                      ? "text-blue-700 font-medium"
                      : i < currentStep
                        ? "text-green-600"
                        : "text-gray-400"
                  }`}
                >
                  <span>{i < currentStep ? "✅" : i === currentStep ? "⏳" : "⬜"}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {answer && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap border">
              {answer}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
