export const appName = process.env.NEXT_PUBLIC_APP_NAME?.trim() || "anti-kothari";
export const isSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
