import {
  pgTable,
  serial,
  varchar,
  integer,
  jsonb,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core"
import type { TriviaCell } from "../types"

// Type for cells JSONB column
export type CellsMap = Record<string, TriviaCell>

// trivia_games table
export const triviaGames = pgTable("trivia_games", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).default("My Trivia Game"),
  columns: integer("columns").notNull().default(5),
  rows: integer("rows").notNull().default(5),
  categories: jsonb("categories").notNull().default([]).$type<string[]>(),
  cells: jsonb("cells").notNull().default({}).$type<CellsMap>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

// trivia_progress table
export const triviaProgress = pgTable(
  "trivia_progress",
  {
    id: serial("id").primaryKey(),
    gameId: integer("game_id")
      .notNull()
      .references(() => triviaGames.id, { onDelete: "cascade" }),
    completedCells: jsonb("completed_cells")
      .notNull()
      .default([])
      .$type<string[]>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_trivia_progress_game_id").on(table.gameId),
    unique("trivia_progress_game_id_unique").on(table.gameId),
  ]
)

// Inferred types for insert and select operations
export type InsertTriviaGame = typeof triviaGames.$inferInsert
export type SelectTriviaGame = typeof triviaGames.$inferSelect
export type InsertTriviaProgress = typeof triviaProgress.$inferInsert
export type SelectTriviaProgress = typeof triviaProgress.$inferSelect
