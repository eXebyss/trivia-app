import { neon } from "@neondatabase/serverless"
import type { TriviaGame, GameProgress } from "./types"

const sql = neon(process.env.DATABASE_URL!)

export async function saveGame(game: TriviaGame): Promise<number> {
  // Always use ID=1 for single board system
  // Check if game with ID=1 exists
  const existing = await sql`
    SELECT id FROM trivia_games WHERE id = 1 LIMIT 1
  `

  if (existing.length > 0) {
    // Update existing game ID=1
    await sql`
      UPDATE trivia_games
      SET name = ${game.name},
          columns = ${game.columns},
          rows = ${game.rows},
          categories = ${JSON.stringify(game.categories)},
          cells = ${JSON.stringify(game.cells)}
      WHERE id = 1
    `
    return 1
  } else {
    // Insert new game with ID=1
    await sql`
      INSERT INTO trivia_games (id, name, columns, rows, categories, cells)
      VALUES (1, ${game.name}, ${game.columns}, ${game.rows}, ${JSON.stringify(game.categories)}, ${JSON.stringify(game.cells)})
    `
    return 1
  }
}

export async function loadGame(gameId = 1): Promise<TriviaGame | null> {
  const result = await sql`
    SELECT id, name, columns, rows, categories, cells
    FROM trivia_games
    WHERE id = ${gameId}
    LIMIT 1
  `

  if (result.length === 0) {
    return null
  }

  const row = result[0]
  return {
    id: row.id,
    name: row.name,
    columns: row.columns,
    rows: row.rows,
    categories: row.categories as string[],
    cells: row.cells as TriviaGame["cells"],
  }
}

export async function saveProgress(gameId: number, progress: GameProgress): Promise<void> {
  await sql`
    INSERT INTO trivia_progress (game_id, completed_cells)
    VALUES (${gameId}, ${JSON.stringify(progress.completedCells)})
    ON CONFLICT (game_id) DO UPDATE
    SET completed_cells = ${JSON.stringify(progress.completedCells)}
  `
}

export async function loadProgress(gameId = 1): Promise<GameProgress | null> {
  const result = await sql`
    SELECT completed_cells
    FROM trivia_progress
    WHERE game_id = ${gameId}
    LIMIT 1
  `

  if (result.length === 0) {
    return null
  }

  return {
    completedCells: result[0].completed_cells as string[],
  }
}

export async function resetProgress(gameId = 1): Promise<void> {
  await sql`
    DELETE FROM trivia_progress
    WHERE game_id = ${gameId}
  `
}

export async function listGames(): Promise<Array<{ id: number; name: string; created_at: Date }>> {
  const result = await sql`
    SELECT id, name, created_at
    FROM trivia_games
    ORDER BY created_at DESC
  `

  return result as Array<{ id: number; name: string; created_at: Date }>
}
