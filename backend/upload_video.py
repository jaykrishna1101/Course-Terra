import os
from dotenv import load_dotenv
load_dotenv()
from app.utils.supabase_client import supabase

def setup_storage_and_upload():
    # 2. Upload the file
    file_path = "c:/Users/jkkho/OneDrive/Documents/species/course-terra/The-Map-of-Mathematics_3.mp4"
    if not os.path.exists(file_path):
        print("File not found at", file_path)
        return
        
    with open(file_path, "rb") as f:
        file_bytes = f.read()
        
    # Upload to Supabase Storage
    try:
        supabase.storage.from_("course-content").upload(
            path="mathematics/The-Map-of-Mathematics.mp4",
            file=file_bytes,
            file_options={"content-type": "video/mp4"}
        )
        print("Successfully uploaded video to Supabase Storage!")
    except Exception as e:
        print("Error uploading video:", e)
        
    # 3. Update the database lesson to point to the new storage path
    # The frontend/backend needs to know it's a supabase storage path, so let's use a specific format
    # The database already has a lesson with storage_path = '/videos/The-Map-of-Mathematics.mp4'
    supabase.table("lessons").update({
        "storage_path": "course-content/mathematics/The-Map-of-Mathematics.mp4"
    }).eq("title", "The Map of Mathematics (Video)").execute()
    print("Updated database lesson path!")

if __name__ == "__main__":
    setup_storage_and_upload()
