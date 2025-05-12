
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the Supabase client from the integration
export const supabase = supabaseClient;

// This function helps determine if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return true; // Since we're now using the integration client which is always configured
}
