import type { TriviaGame, TriviaCell } from "./types"

const STORAGE_KEY = "trivia-games"
const ACTIVE_GAME_KEY = "trivia-active-game"
const PLAY_PROGRESS_KEY = "trivia-play-progress"

export function saveGame(game: TriviaGame): void {
  try {
    const games = getAllGames()
    const index = games.findIndex((g) => g.id === game.id)

    if (index >= 0) {
      games[index] = { ...game, updatedAt: new Date().toISOString() }
    } else {
      games.push(game)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
  } catch (error) {
    console.error("[v0] Error saving game:", error)
    throw new Error("Failed to save game. Please check your browser storage.")
  }
}

export function getAllGames(): TriviaGame[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getGame(id: string): TriviaGame | null {
  const games = getAllGames()
  return games.find((g) => g.id === id) || null
}

export function deleteGame(id: string): void {
  const games = getAllGames().filter((g) => g.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}

export function setActiveGame(gameId: string): void {
  localStorage.setItem(ACTIVE_GAME_KEY, gameId)
}

export function getActiveGameId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACTIVE_GAME_KEY)
}

export function savePlayProgress(gameId: string, cells: { [key: string]: TriviaCell }): void {
  try {
    const progress = {
      gameId,
      cells,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(PLAY_PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error("[v0] Error saving play progress:", error)
    throw new Error("Failed to save play progress.")
  }
}

export function getPlayProgress(gameId: string): { [key: string]: TriviaCell } | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(PLAY_PROGRESS_KEY)
  if (!stored) return null

  const progress = JSON.parse(stored)
  return progress.gameId === gameId ? progress.cells : null
}

export function clearPlayProgress(): void {
  localStorage.removeItem(PLAY_PROGRESS_KEY)
}

export function createDefaultGame(): TriviaGame {
  return {
    id: Date.now().toString(),
    name: "New Trivia Game",
    rows: 5,
    columns: 5,
    categories: Array(5)
      .fill("")
      .map((_, i) => `Category ${i + 1}`),
    cells: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
