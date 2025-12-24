# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build production bundle
pnpm build

# Run production server
pnpm start

# Lint code
pnpm lint
```

## Architecture Overview

### Application Type
Next.js 16 app using the App Router architecture with React Server Components and Server Actions.

### Data Flow Architecture

**Dual Storage System:**
- **Database Layer** (`lib/db.ts`): Neon PostgreSQL for persistent game storage via `@neondatabase/serverless`
  - Tables defined in `scripts/001-create-trivia-tables.sql`
  - `trivia_games`: stores game boards (name, grid dimensions, categories, cells with Q&A)
  - `trivia_progress`: tracks completed cells per game

- **LocalStorage Layer** (`lib/storage.ts`): Browser-based storage (currently unused in main flow but available)

**Server Actions Pattern** (`app/actions.ts`):
- All database operations go through Next.js Server Actions
- Actions wrap `lib/db.ts` functions with error handling and revalidation
- Main actions: `saveGame`, `loadGame`, `saveProgress`, `loadProgress`, `resetProgress`

### State Management

**Single Page Application:**
- `app/page.tsx` is the main (and only) route
- Client-side state managed with React `useState`
- Two modes: "editor" (create/edit game) and "play" (display questions)
- Mode switching triggers automatic save and progress loading

**Game State Structure:**
```typescript
TriviaGame {
  id: number
  name: string
  rows: number
  columns: number
  categories: string[]  // One per column
  cells: { [key: string]: TriviaCell }  // Key format: "row-col"
}

TriviaCell {
  question: string
  answer: string
  played: boolean  // Tracks completion in play mode
}
```

### Component Architecture

**Feature Components:**
- `trivia-grid.tsx`: Main grid display, renders category headers + point buttons
- `question-dialog.tsx`: Modal for editing (editor mode) or revealing Q&A (play mode)
  - Keyboard shortcut: Space bar reveals answer in play mode
- `grid-settings.tsx`: Controls for game name, rows, columns
- `category-editor.tsx`: Edit category labels

**UI Components:**
- Located in `components/ui/` - shadcn/ui components based on Radix UI primitives
- Uses Tailwind CSS v4 for styling
- Theme support via `next-themes` with light/dark modes

### Database Setup

Environment variable required: `DATABASE_URL` (Neon PostgreSQL connection string)

Run SQL migration manually:
```bash
# Execute the SQL file against your Neon database
psql $DATABASE_URL -f scripts/001-create-trivia-tables.sql
```

### TypeScript Configuration

- Path alias `@/*` maps to project root
- Strict mode enabled
- Build errors ignored in production (`next.config.mjs` - `ignoreBuildErrors: true`)

### Key Behaviors

**Cell Point Values:**
- Calculated dynamically: `(row + 1) * 100`
- Row 0 = 100 points, Row 1 = 200 points, etc.

**Play Mode Progress Tracking:**
- Cells marked as `played: true` when answer is revealed and dialog closed
- Progress saved to database after each cell completion
- Reset button clears all progress for current game

**Editor → Play Mode Transition:**
1. Saves current game state
2. Loads saved progress from database
3. Marks cells as played based on progress
4. Switches to play mode UI
