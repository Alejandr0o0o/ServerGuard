import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

// Ahora toma los valores del archivo oculto .env
const supabaseUrl = "https://jstkpziheirixmrhtdtl.supabase.co";
const supabaseAnonKey = "sb_publishable_7NKdFmGrK_6y_in9EVsT_g_UzODGup9";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
