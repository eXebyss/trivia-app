"use client"

import type { TriviaCell } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

interface TriviaGridProps {
  rows: number
  columns: number
  categories: string[]
  cells: { [key: string]: TriviaCell }
  mode: "editor" | "play"
  onCellClick: (row: number, col: number) => void
}

export function TriviaGrid({ rows, columns, categories, cells, mode, onCellClick }: TriviaGridProps) {
  const getCellKey = (row: number, col: number) => `${row}-${col}`
  const getPointValue = (row: number) => (row + 1) * 100

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {categories.map((category, index) => (
          <div key={index} className="bg-primary text-primary-foreground p-4 rounded-lg text-center font-bold text-lg">
            {category || `Category ${index + 1}`}
          </div>
        ))}
      </div>

      <div
        className="grid gap-2 flex-1"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: columns }).map((_, colIndex) => {
            const cellKey = getCellKey(rowIndex, colIndex)
            const cell = cells[cellKey]
            const points = getPointValue(rowIndex)
            const isPlayed = cell?.played || false
            const hasContent = cell && cell.question

            return (
              <Button
                key={cellKey}
                onClick={() => onCellClick(rowIndex, colIndex)}
                className={cn(
                  "h-full min-h-16 text-4xl md:text-5xl font-bold transition-all",
                  isPlayed && mode === "play" && "opacity-30 cursor-not-allowed",
                  !hasContent && mode === "editor" && "bg-muted text-muted-foreground",
                  hasContent && mode === "editor" && "bg-secondary text-secondary-foreground",
                )}
                variant={isPlayed ? "secondary" : "default"}
                disabled={isPlayed && mode === "play"}
              >
                {points}
              </Button>
            )
          }),
        )}
      </div>
    </div>
  )
}
