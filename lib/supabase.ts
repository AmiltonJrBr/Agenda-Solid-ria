import { createClient } from '@supabase/supabase-js';

// Access Supabase keys from the environment variables.
// Users can configure these in their Secrets settings.
const getValidUrl = () => {
  const urls = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL
  ];
  for (const u of urls) {
    if (u && u.startsWith('http')) {
      return u;
    }
  }
  return '';
};

const getValidAnonKey = () => {
  const keys = [
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY
  ];
  for (const k of keys) {
    if (k && !k.startsWith('http') && k.length > 20) {
      return k;
    }
  }
  return '';
};

const rawUrl = getValidUrl();
let rawKey = getValidAnonKey();

let supabaseUrl = rawUrl || 'https://pboylpgcymhzhfxfrmok.supabase.co';
const supabaseAnonKey = rawKey || 'sb_publishable_-93gjTfvZfm1uxTxVslJkw_pcjoyaTH';

// Auto-parse project reference from the new publishable key format if URL is missing
if (!supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'sb_publishable_-93gjTfvZfm1uxTxVslJkw_pcjoyaTH') {
  const parts = supabaseAnonKey.split('_');
  if (parts.length >= 3) {
    const rawRef = parts[2];
    const projectRef = rawRef.startsWith('-') ? rawRef.substring(1) : rawRef;
    supabaseUrl = `https://${projectRef}.supabase.co`;
  }
}

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (supabaseInstance) {
    return supabaseInstance;
  }
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
};

export { supabaseUrl, supabaseAnonKey };

