export const appName = process.env.NEXT_PUBLIC_APP_NAME?.trim() || "anti-kothari";
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
export const isSupabaseConfigured = (()=>{try{const url=new URL(supabaseUrl);return (url.protocol==="https:"||url.protocol==="http:")&&Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}catch{return false}})();
