// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient("https://rvisbxmyjeawkexzbjzz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aXNieG15amVhd2tleHpianp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MzE5ODMsImV4cCI6MjA1NjIwNzk4M30.eEjvbeZbLJ0Zhawf_rku7yqXwgznpGx1llSAmoGwuBM");
