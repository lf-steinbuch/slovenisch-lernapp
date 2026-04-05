import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://fgxezqjncbbqsymrhkbj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZneGV6cWpuY2JicXN5bXJoa2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyOTgwNTcsImV4cCI6MjA5MDg3NDA1N30.dNMiIJ6--obnfWWKvhFB2Qn2nJe6P7TF5_IjA8hxTms'
)
