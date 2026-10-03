import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

print("--- PROFILES ---")
res = supabase.table('profiles').select('*').execute()
print(res.data)

print("\n--- COURSES ---")
res2 = supabase.table('courses').select('*').execute()
print(res2.data)
