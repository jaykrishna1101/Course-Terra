import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(supabase_url, supabase_key)

email = "jkkhond@gmail.com"
password = "password123"

try:
    print(f"Creating user {email} via Admin API to bypass rate limits...")
    user = supabase.auth.admin.create_user({
        "email": email,
        "password": password,
        "email_confirm": True,
        "user_metadata": {"full_name": "Jaykrishna Khond"}
    })
    print(f"Success! User created with ID: {user.user.id}")
    print(f"You can now log in with email: {email} and password: {password}")
    print("Don't forget to run seed.sql in the SQL Editor now!")
except Exception as e:
    print(f"Error: {e}")
