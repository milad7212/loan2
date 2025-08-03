import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vdkgxgqucftikkskclem.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka2d4Z3F1Y2Z0aWtrc2tjbGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODEyOTEsImV4cCI6MjA2ODg1NzI5MX0.ELaxMvvc07oEPk577srleEI3Vb-L6a2Nw4RUJn0Lzz8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
