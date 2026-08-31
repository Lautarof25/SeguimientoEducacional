export function getSupabaseClient() {
    const config = window.SUPABASE_CONFIG || {};
    return window.supabase && config.url && config.anonKey
        ? window.supabase.createClient(config.url, config.anonKey)
        : null;
}
