import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Agar env vars nahi hain to null return karo (graceful fallback)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type VisitorRow = {
  id: number;
  country: string;
  city: string;
  lat: number;
  lng: number;
  visited_at: string;
};
