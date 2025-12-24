"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import type { TriviaCell } from "@/lib/types"

interface QuestionDialogProps {
  open: boolean
  mode: "editor" | "play"
  cell: TriviaCell | null
  points: number
  onClose: () => void
  onSave?: (question: string, answer: string) => void
  onMarkPlayed?: () => void
}

export function QuestionDialog({ open, mode, cell, points, onClose, onSave, onMarkPlayed }: QuestionDialogProps) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    if (open && cell) {
      setQuestion(cell.question || "")
      setAnswer(cell.answer || "")
      setShowAnswer(false)
    } else if (!open) {
      setQuestion("")
      setAnswer("")
      setShowAnswer(false)
    }
  }, [open, cell])

  useEffect(() => {
    if (mode === "play" && open) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.code === "Space") {
          e.preventDefault()
          if (!showAnswer) {
            setShowAnswer(true)
          }
        }
      }

      window.addEventListener("keydown", handleKeyPress)
      return () => window.removeEventListener("keydown", handleKeyPress)
    }
  }, [mode, open, showAnswer])

  const handleSave = () => {
    if (onSave) {
      onSave(question, answer)
    }
    onClose()
  }

  const handleRevealAnswer = () => {
    setShowAnswer(true)
  }

  const handleClose = () => {
    if (mode === "play" && showAnswer && onMarkPlayed) {
      onMarkPlayed()
    }
    onClose()
  }

  if (mode === "editor") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Question ({points} points)</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question here..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the answer here..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-4xl">{points} Points</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Question:</h3>
            <p className="text-3xl leading-relaxed">{cell?.question || "No question set"}</p>
          </div>

          {showAnswer && (
            <div className="border-t pt-8">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Answer:</h3>
              <p className="text-3xl leading-relaxed">{cell?.answer || "No answer set"}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {!showAnswer ? (
            <Button onClick={handleRevealAnswer} size="lg" className="w-full text-xl py-6">
              Reveal Answer (Space)
            </Button>
          ) : (
            <Button onClick={handleClose} variant="outline" size="lg" className="w-full bg-transparent text-xl py-6">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
