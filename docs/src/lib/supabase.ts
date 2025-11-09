import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Letter {
  id: string;
  title: string;
  message: string;
  photo_url: string | null;
  youtube_music_url: string | null;
  author_id: string;
  created_at: string;
  users?: User;
}
