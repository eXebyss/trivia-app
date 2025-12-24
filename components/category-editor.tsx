"use client"

import { Input } from "./ui/input"

interface CategoryEditorProps {
  categories: string[]
  onCategoryChange: (index: number, value: string) => void
}

export function CategoryEditor({ categories, onCategoryChange }: CategoryEditorProps) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
      {categories.map((category, index) => (
        <Input
          key={index}
          value={category}
          onChange={(e) => onCategoryChange(index, e.target.value)}
          placeholder={`Category ${index + 1}`}
          className="text-center font-semibold"
        />
      ))}
    </div>
  )
}
