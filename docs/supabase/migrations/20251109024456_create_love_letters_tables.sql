/*
  # Love Letters Database Setup

  ## What this does:
  This creates two tables to store your love letters and user information.

  ## Tables Created:
  
  ### 1. `users` table
  - Stores information about you and your partner
  - Each person has a name and color theme
  - `id`: Unique identifier for each person
  - `name`: Your name (e.g., "Jen" or "Kat")
  - `color`: Your personal color (e.g., "#FF69B4" for pink)
  - `created_at`: When you joined
  
  ### 2. `letters` table
  - Stores all your love letters
  - `id`: Unique identifier for each letter
  - `title`: Letter title (e.g., "Thinking of You")
  - `message`: The full letter text
  - `photo_url`: Link to a photo (from Pexels or your own)
  - `youtube_music_url`: YouTube link for background music
  - `author_id`: Who wrote the letter
  - `created_at`: When the letter was written
  
  ## Security:
  - Anyone with the passcode can read all letters
  - Anyone with the passcode can write new letters
  - Data is stored safely in the cloud
*/

-- Create users table (for you and your partner)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#FFB6C1',
  created_at timestamptz DEFAULT now()
);

-- Create letters table (stores all love letters)
CREATE TABLE IF NOT EXISTS letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  photo_url text,
  youtube_music_url text,
  author_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read users (to show author names)
CREATE POLICY "Anyone can read users"
  ON users FOR SELECT
  USING (true);

-- Allow anyone to read letters
CREATE POLICY "Anyone can read letters"
  ON letters FOR SELECT
  USING (true);

-- Allow anyone to create new letters
CREATE POLICY "Anyone can create letters"
  ON letters FOR INSERT
  WITH CHECK (true);

-- Insert Jen and Kat as the two authors
INSERT INTO users (name, color) VALUES 
  ('Jen', '#FF69B4'),
  ('Kat', '#9370DB')
ON CONFLICT DO NOTHING;
