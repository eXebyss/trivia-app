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
}

export type GameMode = "editor" | "play"
