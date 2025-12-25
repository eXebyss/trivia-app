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
        } else if (e.code === "Escape" && showAnswer) {
          e.preventDefault()
          handleClose()
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
      <DialogContent className="w-[95vw] h-[95vh] !max-w-[95vw] max-h-[95vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-5xl md:text-6xl lg:text-7xl text-center">{points} Points</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col justify-center py-8 overflow-auto">
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 text-muted-foreground">Question:</h3>
            <p className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight font-medium">{cell?.question || "No question set"}</p>
          </div>

          {showAnswer && (
            <div className="border-t mt-16 pt-16 text-center">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 text-primary">Answer:</h3>
              <p className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight font-medium">{cell?.answer || "No answer set"}</p>
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0 flex gap-2">
          {!showAnswer ? (
            <Button onClick={handleRevealAnswer} size="lg" className="w-full text-2xl md:text-3xl py-8">
              Reveal Answer (Space)
            </Button>
          ) : (
            <Button onClick={handleClose} variant="outline" size="lg" className="w-full bg-transparent text-2xl md:text-3xl py-8">
              Close (Esc)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
