-- Users table (Supabase handles auth, but you may want extra profile fields)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Trips table
CREATE TABLE IF NOT EXISTS ai_trips (
  id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  title TEXT,
  trip_data JSONB,
  form_inputs JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);