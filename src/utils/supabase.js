import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

// Ahora toma los valores del archivo oculto .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
