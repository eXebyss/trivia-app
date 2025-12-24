import { eq, desc } from "drizzle-orm"
import { db, triviaGames, triviaProgress } from "./index"
import type { TriviaGame, GameProgress } from "../types"

export async function saveGame(game: TriviaGame): Promise<number> {
  // Always use ID=1 for single board system
  const existing = await db
    .select({ id: triviaGames.id })
    .from(triviaGames)
    .where(eq(triviaGames.id, 1))
    .limit(1)

  if (existing.length > 0) {
    // Update existing game ID=1
    await db
      .update(triviaGames)
      .set({
        name: game.name,
        columns: game.columns,
        rows: game.rows,
        categories: game.categories,
        cells: game.cells,
      })
      .where(eq(triviaGames.id, 1))
    return 1
  } else {
    // Insert new game with ID=1
    await db.insert(triviaGames).values({
      id: 1,
      name: game.name,
      columns: game.columns,
      rows: game.rows,
      categories: game.categories,
      cells: game.cells,
    })
    return 1
  }
}

export async function loadGame(gameId = 1): Promise<TriviaGame | null> {
  const result = await db
    .select({
      id: triviaGames.id,
      name: triviaGames.name,
      columns: triviaGames.columns,
      rows: triviaGames.rows,
      categories: triviaGames.categories,
      cells: triviaGames.cells,
    })
    .from(triviaGames)
    .where(eq(triviaGames.id, gameId))
    .limit(1)

  if (result.length === 0) {
    return null
  }

  const row = result[0]
  return {
    id: row.id,
    name: row.name ?? "My Trivia Game",
    columns: row.columns,
    rows: row.rows,
    categories: row.categories,
    cells: row.cells,
  }
}

export async function saveProgress(
  gameId: number,
  progress: GameProgress
): Promise<void> {
  await db
    .insert(triviaProgress)
    .values({
      gameId,
      completedCells: progress.completedCells,
    })
    .onConflictDoUpdate({
      target: triviaProgress.gameId,
      set: {
        completedCells: progress.completedCells,
      },
    })
}

export async function loadProgress(gameId = 1): Promise<GameProgress | null> {
  const result = await db
    .select({
      completedCells: triviaProgress.completedCells,
    })
    .from(triviaProgress)
    .where(eq(triviaProgress.gameId, gameId))
    .limit(1)

  if (result.length === 0) {
    return null
  }

  return {
    completedCells: result[0].completedCells,
  }
}

export async function resetProgress(gameId = 1): Promise<void> {
  await db.delete(triviaProgress).where(eq(triviaProgress.gameId, gameId))
}

export async function listGames(): Promise<
  Array<{ id: number; name: string; created_at: Date }>
> {
  const result = await db
    .select({
      id: triviaGames.id,
      name: triviaGames.name,
      createdAt: triviaGames.createdAt,
    })
    .from(triviaGames)
    .orderBy(desc(triviaGames.createdAt))

  return result.map((row) => ({
    id: row.id,
    name: row.name ?? "My Trivia Game",
    created_at: row.createdAt ?? new Date(),
  }))
}
