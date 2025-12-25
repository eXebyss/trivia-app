export interface TriviaCell {
  question: string
  answer: string
  played: boolean
}

export interface TriviaGame {
  id: number
  name: string
  rows: number
  columns: number
  categories: string[]
  cells: { [key: string]: TriviaCell }
  createdAt?: string
  updatedAt?: string
}

export type GameMode = "editor" | "play"

export type GameProgress = {
  completedCells: string[]
}
