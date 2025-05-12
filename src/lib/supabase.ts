
import { createClient } from '@supabase/supabase-js';

// Default to empty strings for development to prevent immediate crash
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// This function helps determine if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-url.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-key'
  );
}
