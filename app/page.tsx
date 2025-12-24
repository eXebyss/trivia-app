"use client"

import { useEffect, useState } from "react"
import type { TriviaGame, TriviaCell, GameMode } from "@/lib/types"
import {
  saveGame as saveGameAction,
  loadGame as loadGameAction,
  saveProgress as saveProgressAction,
  loadProgress as loadProgressAction,
  resetProgress as resetProgressAction,
} from "@/app/actions"
import { GridSettings } from "@/components/grid-settings"
import { CategoryEditor } from "@/components/category-editor"
import { TriviaGrid } from "@/components/trivia-grid"
import { QuestionDialog } from "@/components/question-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Edit, Play, RotateCcw, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

export default function TriviaPage() {
  const [game, setGame] = useState<TriviaGame | null>(null)
  const [mode, setMode] = useState<GameMode>("editor")
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function loadGameData() {
      try {
        const result = await loadGameAction(1)

        if (result.success && result.game) {
          setGame(result.game)
        } else {
          // Create default game if none exists
          const defaultGame: TriviaGame = {
            id: 1,
            name: "My Trivia Game",
            columns: 5,
            rows: 5,
            categories: ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"],
            cells: {},
          }
          setGame(defaultGame)
          await saveGameAction(defaultGame)
        }
      } catch (error) {
        toast({
          title: "Error loading game",
          description: "Failed to load game from database. Using default game.",
          variant: "destructive",
        })
        // Fallback to default game
        const defaultGame: TriviaGame = {
          id: 1,
          name: "My Trivia Game",
          columns: 5,
          rows: 5,
          categories: ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"],
          cells: {},
        }
        setGame(defaultGame)
      } finally {
        setIsLoading(false)
      }
    }

    loadGameData()
  }, [toast])

  const handleSaveGame = async () => {
    if (game) {
      setIsSaving(true)
      try {
        const result = await saveGameAction(game)
        if (result.success) {
          toast({
            title: "Game saved",
            description: "Your trivia game has been saved successfully.",
          })
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        toast({
          title: "Error saving game",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleRowsChange = (rows: number) => {
    if (game) {
      setGame({ ...game, rows })
    }
  }

  const handleColumnsChange = (columns: number) => {
    if (game) {
      const newCategories = Array(columns)
        .fill("")
        .map((_, i) => game.categories[i] || `Category ${i + 1}`)
      setGame({ ...game, columns, categories: newCategories })
    }
  }

  const handleGameNameChange = (name: string) => {
    if (game) {
      setGame({ ...game, name })
    }
  }

  const handleCategoryChange = (index: number, value: string) => {
    if (game) {
      const newCategories = [...game.categories]
      newCategories[index] = value
      setGame({ ...game, categories: newCategories })
    }
  }

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col })
    setDialogOpen(true)
  }

  const getCellKey = (row: number, col: number) => `${row}-${col}`

  const handleSaveCell = (question: string, answer: string) => {
    if (game && selectedCell) {
      const cellKey = getCellKey(selectedCell.row, selectedCell.col)
      const newCells = {
        ...game.cells,
        [cellKey]: {
          question,
          answer,
          played: false,
        },
      }
      setGame({ ...game, cells: newCells })
    }
  }

  const handleMarkPlayed = async () => {
    if (game && selectedCell && mode === "play") {
      const cellKey = getCellKey(selectedCell.row, selectedCell.col)
      const newCells = {
        ...game.cells,
        [cellKey]: {
          ...game.cells[cellKey],
          played: true,
        },
      }
      setGame({ ...game, cells: newCells })

      try {
        const completedCells = Object.keys(newCells).filter((key) => newCells[key]?.played)
        await saveProgressAction(game.id, { completedCells })
      } catch (error) {
        toast({
          title: "Error saving progress",
          description: "Failed to save your play progress.",
          variant: "destructive",
        })
      }
    }
  }

  const handleModeSwitch = async (newMode: GameMode) => {
    if (newMode === "play" && game) {
      setIsSaving(true)
      try {
        await handleSaveGame()

        const progressResult = await loadProgressAction(game.id)
        if (progressResult.success && progressResult.progress) {
          // Mark cells as played based on saved progress
          const newCells = { ...game.cells }
          progressResult.progress.completedCells.forEach((cellKey) => {
            if (newCells[cellKey]) {
              newCells[cellKey] = { ...newCells[cellKey], played: true }
            }
          })
          setGame({ ...game, cells: newCells })
        }
      } catch (error) {
        toast({
          title: "Error loading progress",
          description: "Failed to load your play progress.",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }
    setMode(newMode)
  }

  const handleResetGame = async () => {
    if (game) {
      const resetCells: { [key: string]: TriviaCell } = {}
      Object.keys(game.cells).forEach((key) => {
        resetCells[key] = {
          ...game.cells[key],
          played: false,
        }
      })
      setGame({ ...game, cells: resetCells })

      try {
        await resetProgressAction(game.id)
        toast({
          title: "Game reset",
          description: "All cells have been reset. You can play again!",
        })
      } catch (error) {
        toast({
          title: "Error resetting game",
          description: "Failed to reset game progress.",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Spinner className="size-8" />
        <p className="text-lg text-muted-foreground">Loading trivia game...</p>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Failed to load game. Please refresh the page.</p>
      </div>
    )
  }

  const currentCell = selectedCell ? game.cells[getCellKey(selectedCell.row, selectedCell.col)] : null
  const currentPoints = selectedCell ? (selectedCell.row + 1) * 100 : 0

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">{game.name}</h1>
            <p className="text-muted-foreground mt-1">{mode === "editor" ? "Edit your trivia board" : "Play trivia"}</p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {mode === "editor" ? (
              <>
                <Button onClick={handleSaveGame} variant="outline" disabled={isSaving}>
                  {isSaving ? <Spinner /> : <Save className="mr-2 h-4 w-4" />}
                  Save
                </Button>
                <Button onClick={() => handleModeSwitch("play")} disabled={isSaving}>
                  {isSaving ? <Spinner /> : <Play className="mr-2 h-4 w-4" />}
                  Play Mode
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleResetGame} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={() => handleModeSwitch("editor")} variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Editor
                </Button>
              </>
            )}
          </div>
        </div>

        {mode === "editor" && (
          <div className="space-y-4">
            <GridSettings
              rows={game.rows}
              columns={game.columns}
              gameName={game.name}
              onRowsChange={handleRowsChange}
              onColumnsChange={handleColumnsChange}
              onGameNameChange={handleGameNameChange}
            />

            <CategoryEditor categories={game.categories} onCategoryChange={handleCategoryChange} />
          </div>
        )}

        <TriviaGrid
          rows={game.rows}
          columns={game.columns}
          categories={game.categories}
          cells={game.cells}
          mode={mode}
          onCellClick={handleCellClick}
        />

        <QuestionDialog
          open={dialogOpen}
          mode={mode}
          cell={currentCell}
          points={currentPoints}
          onClose={() => setDialogOpen(false)}
          onSave={mode === "editor" ? handleSaveCell : undefined}
          onMarkPlayed={mode === "play" ? handleMarkPlayed : undefined}
        />
      </div>
    </div>
  )
}
