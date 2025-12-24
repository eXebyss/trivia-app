"use server"

import { revalidatePath } from "next/cache"
import {
  saveGame as dbSaveGame,
  loadGame as dbLoadGame,
  saveProgress as dbSaveProgress,
  loadProgress as dbLoadProgress,
  resetProgress as dbResetProgress,
} from "@/lib/db/queries"
import type { TriviaGame, GameProgress } from "@/lib/types"

export async function saveGame(game: TriviaGame) {
  try {
    const gameId = await dbSaveGame(game)
    revalidatePath("/")
    return { success: true, gameId }
  } catch (error) {
    console.error("Failed to save game:", error)
    return { success: false, error: "Failed to save game to database" }
  }
}

export async function loadGame(gameId?: number) {
  try {
    const game = await dbLoadGame(gameId)
    return { success: true, game }
  } catch (error) {
    console.error("Failed to load game:", error)
    return { success: false, error: "Failed to load game from database" }
  }
}

export async function saveProgress(gameId: number, progress: GameProgress) {
  try {
    await dbSaveProgress(gameId, progress)
    return { success: true }
  } catch (error) {
    console.error("Failed to save progress:", error)
    return { success: false, error: "Failed to save progress to database" }
  }
}

export async function loadProgress(gameId?: number) {
  try {
    const progress = await dbLoadProgress(gameId)
    return { success: true, progress }
  } catch (error) {
    console.error("Failed to load progress:", error)
    return { success: false, error: "Failed to load progress from database" }
  }
}

export async function resetProgress(gameId?: number) {
  try {
    await dbResetProgress(gameId)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to reset progress:", error)
    return { success: false, error: "Failed to reset progress in database" }
  }
}
