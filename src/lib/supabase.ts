import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export const supabase = config.supabase.isConfigured
  ? createClient(config.supabase.url, config.supabase.anonKey)
  : null;

export const isSupabaseConfigured = (): boolean => {
  return config.supabase.isConfigured && supabase !== null;
};
