"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlaceData } from "@/types"

interface AIModalProps {
  location: string
  places: PlaceData[]
}

export default function AIModal({ location, places }: AIModalProps) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleAsk() {
    setLoading(true)
    setAnswer("")
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, location, places }),
    })
    const data = await res.json()
    setAnswer(data.answer)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        💬 Tanya AI
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
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <Button onClick={handleAsk} disabled={loading || !question} className="w-full">
            {loading ? "Memproses..." : "Tanya"}
          </Button>
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
