-- Create trivia_games table to store trivia game boards
CREATE TABLE IF NOT EXISTS trivia_games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) DEFAULT 'My Trivia Game',
  columns INTEGER NOT NULL DEFAULT 5,
  rows INTEGER NOT NULL DEFAULT 5,
  categories JSONB NOT NULL DEFAULT '[]',
  cells JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trivia_progress table to store play progress
CREATE TABLE IF NOT EXISTS trivia_progress (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES trivia_games(id) ON DELETE CASCADE,
  completed_cells JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(game_id)
);

-- Create index on game_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_trivia_progress_game_id ON trivia_progress(game_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_trivia_games_updated_at ON trivia_games;
CREATE TRIGGER update_trivia_games_updated_at
    BEFORE UPDATE ON trivia_games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trivia_progress_updated_at ON trivia_progress;
CREATE TRIGGER update_trivia_progress_updated_at
    BEFORE UPDATE ON trivia_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
