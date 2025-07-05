import { createClient } from '@supabase/supabase-js'

// 👇 auto-typed by supabase-js
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
)

export default supabase
