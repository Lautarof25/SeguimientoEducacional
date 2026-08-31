import { createApp } from './src/app.js';
import { getSupabaseClient } from './src/config.js';

const supabaseClient = getSupabaseClient();
createApp({ document, window, supabaseClient });
