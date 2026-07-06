import { supabase, type VisitorRow } from './supabase';

// =========================================================================
//  Visitor tracking — logs + fetches via Supabase
//  Falls back gracefully if Supabase is not configured.
// =========================================================================

const VISITOR_CACHE_KEY = 'portfolio-visitor-logged';

interface LocationData {
  country: string;
  city: string;
  lat: number;
  lng: number;
}

// Fetch current visitor's location from a free IP API
async function fetchCurrentLocation(): Promise<LocationData | null> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return null;
    const data = await res.json();
    return {
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      lat: data.latitude || 0,
      lng: data.longitude || 0,
    };
  } catch {
    return null;
  }
}

// Log this visitor to Supabase (throttled: once per day per browser)
export async function logVisitor(): Promise<LocationData | null> {
  // Check throttle (localStorage)
  const lastLogged = localStorage.getItem(VISITOR_CACHE_KEY);
  if (lastLogged) {
    const elapsed = Date.now() - parseInt(lastLogged, 10);
    if (elapsed < 24 * 60 * 60 * 1000) {
      // Already logged today — skip
      return null;
    }
  }

  const location = await fetchCurrentLocation();
  if (!location) return location;

  // If Supabase is not configured, return location without logging
  if (!supabase) {
    return location;
  }

  try {
    // Insert visitor record
    await supabase.from('visitors').insert({
      country: location.country,
      city: location.city,
      lat: location.lat,
      lng: location.lng,
    });

    // Set throttle marker
    localStorage.setItem(VISITOR_CACHE_KEY, String(Date.now()));
  } catch {
    // Silently fail — analytics shouldn't break the page
  }

  return location;
}

// Fetch all visitors from Supabase
export async function fetchVisitors(): Promise<VisitorRow[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('visited_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

// Get all visitors (local first, then Supabase)
export async function getAllVisitors(): Promise<VisitorRow[]> {
  const dbVisitors = await fetchVisitors();
  return dbVisitors;
}
