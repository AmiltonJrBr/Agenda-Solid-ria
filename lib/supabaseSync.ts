import { getSupabaseClient } from './supabase';

export interface Opportunity {
  id: number;
  title: string;
  category: string;
  distance: string;
  duration: string;
  filled: number;
  total: number;
  description: string;
  image: string;
}

export interface EventItem {
  id: number;
  title: string;
  category: string;
  badge: string;
  date: string;
  location: string;
  progress: number;
  filled: number;
  total: number;
  image: string;
  admins?: string;
}

export interface Talent {
  id: number;
  name: string;
  email: string;
  skills: string[];
  availability: string;
  projects: number;
  rating: number;
  progress: number;
  image: string;
}

export interface Application {
  id: number;
  title: string;
  time: string;
  icon: string;
  status: string;
  type: string;
}

export interface SystemSettings {
  ongName: string;
  contactEmail: string;
  targetHours: number;
  notifyOnNewSignup: boolean;
  enableSoundAlerts: boolean;
}

// Check if a specific table exists and is accessible.
// Returns { success: boolean, reason?: string, needsMigration?: boolean }
export async function checkSupabaseStatus() {
  const supabase = getSupabaseClient() as any;
  if (!supabase) {
    return { success: false, reason: 'Supabase URL or Anon Key is missing in environment variables.' };
  }

  try {
    const { error } = await supabase.from('opportunities').select('id').limit(1);
    if (error) {
      if (error.code === 'PGRST116' || error.code === '42P01' || error.message?.includes('does not exist')) {
        return { success: true, needsMigration: true, reason: 'Supabase is connected, but the required tables do not exist yet.' };
      }
      return { success: false, reason: `Error connecting to database: ${error.message}` };
    }
    return { success: true, needsMigration: false };
  } catch (err: any) {
    return { success: false, reason: err.message || 'Unknown connection error.' };
  }
}

// Fetch Opportunities
export async function fetchOpportunities(initialData: Opportunity[]): Promise<{ data: Opportunity[]; source: 'supabase' | 'fallback' }> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return { data: initialData, source: 'fallback' };

  try {
    const { data, error } = await supabase.from('opportunities').select('*').order('id', { ascending: true });
    if (error || !data) {
      console.warn('Failed to fetch opportunities from Supabase, using mock fallback:', error);
      return { data: initialData, source: 'fallback' };
    }
    return { data: data as Opportunity[], source: 'supabase' };
  } catch (err) {
    console.error('Error in fetchOpportunities:', err);
    return { data: initialData, source: 'fallback' };
  }
}

// Seed Database if empty and tables exist
export async function seedSupabaseIfNeeded(
  initialOpps: Opportunity[],
  initialEvents: EventItem[],
  initialTalents: Talent[]
) {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return;

  try {
    // Opportunities
    const { count: oppCount } = await supabase.from('opportunities').select('id', { count: 'exact', head: true });
    if (oppCount === 0) {
      await supabase.from('opportunities').insert(initialOpps);
    }

    // Events
    const { count: eventCount } = await supabase.from('events').select('id', { count: 'exact', head: true });
    if (eventCount === 0) {
      // Map to exact column format if needed
      await supabase.from('events').insert(initialEvents);
    }

    // Talents
    const { count: talentCount } = await supabase.from('talents').select('id', { count: 'exact', head: true });
    if (talentCount === 0) {
      await supabase.from('talents').insert(initialTalents);
    }
  } catch (e) {
    console.warn('Seeding failed or tables do not exist yet:', e);
  }
}

// Fetch Events
export async function fetchEvents(initialData: EventItem[]): Promise<{ data: EventItem[]; source: 'supabase' | 'fallback' }> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return { data: initialData, source: 'fallback' };

  try {
    const { data, error } = await supabase.from('events').select('*').order('id', { ascending: false });
    if (error || !data) {
      console.warn('Failed to fetch events from Supabase, using mock fallback:', error);
      return { data: initialData, source: 'fallback' };
    }
    return { data: data as EventItem[], source: 'supabase' };
  } catch (err) {
    console.error('Error in fetchEvents:', err);
    return { data: initialData, source: 'fallback' };
  }
}

// Fetch Talents
export async function fetchTalents(initialData: Talent[]): Promise<{ data: Talent[]; source: 'supabase' | 'fallback' }> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return { data: initialData, source: 'fallback' };

  try {
    const { data, error } = await supabase.from('talents').select('*').order('id', { ascending: false });
    if (error || !data) {
      console.warn('Failed to fetch talents from Supabase, using mock fallback:', error);
      return { data: initialData, source: 'fallback' };
    }
    return { data: data as Talent[], source: 'supabase' };
  } catch (err) {
    console.error('Error in fetchTalents:', err);
    return { data: initialData, source: 'fallback' };
  }
}

// Fetch Applications
export async function fetchApplications(initialData: Application[]): Promise<{ data: Application[]; source: 'supabase' | 'fallback' }> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return { data: initialData, source: 'fallback' };

  try {
    const { data, error } = await supabase.from('applications').select('*').order('id', { ascending: true });
    if (error || !data) {
      console.warn('Failed to fetch applications from Supabase, using mock fallback:', error);
      return { data: initialData, source: 'fallback' };
    }
    return { data: data as Application[], source: 'supabase' };
  } catch (err) {
    console.error('Error in fetchApplications:', err);
    return { data: initialData, source: 'fallback' };
  }
}

// Fetch Settings
export async function fetchSettings(initialData: SystemSettings): Promise<{ data: SystemSettings; source: 'supabase' | 'fallback' }> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return { data: initialData, source: 'fallback' };

  try {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 'system_settings').single();
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('No settings row found in Supabase. Creating default row...');
        await saveSettings(initialData);
        return { data: initialData, source: 'supabase' };
      }
      console.warn('Failed to fetch settings from Supabase, using local fallback:', error);
      return { data: initialData, source: 'fallback' };
    }
    if (!data) {
      return { data: initialData, source: 'fallback' };
    }
    return {
      data: {
        ongName: data.ong_name,
        contactEmail: data.contact_email,
        targetHours: data.target_hours,
        notifyOnNewSignup: data.notify_on_new_signup,
        enableSoundAlerts: data.enable_sound_alerts,
      } as SystemSettings,
      source: 'supabase'
    };
  } catch (err) {
    console.error('Error in fetchSettings:', err);
    return { data: initialData, source: 'fallback' };
  }
}

// Save/Upsert Opportunity
export async function saveOpportunity(opp: Opportunity): Promise<boolean> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('opportunities').upsert(opp);
    return !error;
  } catch (e) {
    console.error('saveOpportunity error:', e);
    return false;
  }
}

// Save/Upsert Event
export async function saveEvent(event: EventItem): Promise<boolean> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('events').upsert(event);
    return !error;
  } catch (e) {
    console.error('saveEvent error:', e);
    return false;
  }
}

// Delete Event
export async function removeEvent(id: number): Promise<boolean> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.error('removeEvent error:', e);
    return false;
  }
}

// Save/Upsert Talent
export async function saveTalent(talent: Talent): Promise<boolean> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('talents').upsert(talent);
    return !error;
  } catch (e) {
    console.error('saveTalent error:', e);
    return false;
  }
}

// Delete Talent
export async function removeTalent(id: number): Promise<boolean> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('talents').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.error('removeTalent error:', e);
    return false;
  }
}

// Save/Upsert Application
export async function saveApplication(app: Application): Promise<boolean> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('applications').upsert(app);
    return !error;
  } catch (e) {
    console.error('saveApplication error:', e);
    return false;
  }
}

// Delete Application
export async function removeApplication(id: number): Promise<boolean> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('applications').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.error('removeApplication error:', e);
    return false;
  }
}

// Save Settings
export async function saveSettings(settings: SystemSettings): Promise<boolean> {
  const supabase = getSupabaseClient() as any;
  if (!supabase) return false;

  try {
    const dbPayload = {
      id: 'system_settings',
      ong_name: settings.ongName,
      contact_email: settings.contactEmail,
      target_hours: settings.targetHours,
      notify_on_new_signup: settings.notifyOnNewSignup,
      enable_sound_alerts: settings.enableSoundAlerts,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('settings').upsert(dbPayload);
    return !error;
  } catch (e) {
    console.error('saveSettings error:', e);
    return false;
  }
}

// SQL Script for migration (can be shown to the user)
export const SQL_MIGRATION_SCRIPT = `-- SQL para habilitar tabelas no Supabase SQL Editor:

-- 1. Tabela de Oportunidades (Opportunities)
CREATE TABLE IF NOT EXISTS opportunities (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  distance TEXT NOT NULL,
  duration TEXT NOT NULL,
  filled INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Tabela de Eventos (Events)
CREATE TABLE IF NOT EXISTS events (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  badge TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  filled INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  image TEXT,
  admins TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela de Talentos (Talents)
CREATE TABLE IF NOT EXISTS talents (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  availability TEXT NOT NULL,
  projects INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  progress INTEGER DEFAULT 0,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabela de Inscrições (Applications)
CREATE TABLE IF NOT EXISTS applications (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  time TEXT NOT NULL,
  icon TEXT NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Tabela de Configurações (Settings)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  ong_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  target_hours INTEGER DEFAULT 5000,
  notify_on_new_signup BOOLEAN DEFAULT TRUE,
  enable_sound_alerts BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Configurações de RLS (Row Level Security) para acesso público simplificado
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on opportunities" ON opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on opportunities" ON opportunities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on opportunities" ON opportunities FOR DELETE USING (true);

CREATE POLICY "Allow public read access on events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on events" ON events FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on events" ON events FOR DELETE USING (true);

CREATE POLICY "Allow public read access on talents" ON talents FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on talents" ON talents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on talents" ON talents FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on talents" ON talents FOR DELETE USING (true);

CREATE POLICY "Allow public read access on applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on applications" ON applications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on applications" ON applications FOR DELETE USING (true);

CREATE POLICY "Allow public read access on settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on settings" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on settings" ON settings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on settings" ON settings FOR DELETE USING (true);
`;
