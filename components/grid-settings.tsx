"use client"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card } from "./ui/card"

interface GridSettingsProps {
  rows: number
  columns: number
  gameName: string
  onRowsChange: (rows: number) => void
  onColumnsChange: (columns: number) => void
  onGameNameChange: (name: string) => void
}

export function GridSettings({
  rows,
  columns,
  gameName,
  onRowsChange,
  onColumnsChange,
  onGameNameChange,
}: GridSettingsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="game-name">Game Name</Label>
          <Input
            id="game-name"
            value={gameName}
            onChange={(e) => onGameNameChange(e.target.value)}
            placeholder="Enter game name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rows">Rows</Label>
            <Input
              id="rows"
              type="number"
              min={1}
              max={10}
              value={rows}
              onChange={(e) => onRowsChange(Number.parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="columns">Columns</Label>
            <Input
              id="columns"
              type="number"
              min={1}
              max={10}
              value={columns}
              onChange={(e) => onColumnsChange(Number.parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
