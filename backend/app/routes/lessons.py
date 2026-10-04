from flask import Blueprint, jsonify, request, g
from app.utils.supabase_client import supabase
from app.middleware.auth import require_auth

lessons_bp = Blueprint('lessons', __name__)

@lessons_bp.route('/<lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    try:
        # Only return metadata for public unauthenticated access if it's preview.
        # But for simplicity, the main logic for fetching content is in /content.
        res = supabase.table("lessons").select("id, module_id, title, description, lesson_type, sort_order, is_preview").eq("id", lesson_id).single().execute()
        if not res.data:
            return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Lesson not found"}}), 404
            
        return jsonify({"success": True, "data": res.data})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500

@lessons_bp.route('/<lesson_id>/content', methods=['GET'])
@require_auth
def get_lesson_content(lesson_id):
    try:
        # Check if user is admin
        profile_res = supabase.table("profiles").select("role").eq("id", g.user.id).single().execute()
        is_admin = profile_res.data and profile_res.data.get('role') == 'admin'
        
        # Fetch lesson
        res = supabase.table("lessons").select("*").eq("id", lesson_id).single().execute()
        if not res.data:
            return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Lesson not found"}}), 404
            
        lesson = res.data
        
        if not is_admin and not lesson['is_preview']:
            # Verify enrollment
            # First find the course_id via module
            module_res = supabase.table("course_modules").select("course_id").eq("id", lesson['module_id']).single().execute()
            if not module_res.data:
                return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Module not found"}}), 404
                
            course_id = module_res.data['course_id']
            enrollment = supabase.table("enrollments").select("id").eq("user_id", g.user.id).eq("course_id", course_id).eq("status", "active").execute()
            
            if len(enrollment.data) == 0:
                return jsonify({"success": False, "error": {"code": "FORBIDDEN", "message": "Not enrolled in this course"}}), 403
                
        # User has access, prepare content
        data_to_return = {
            "content": lesson.get("content"),
            "external_url": lesson.get("external_url"),
            "lesson_type": lesson.get("lesson_type")
        }
        
        # If storage_path exists, generate signed URL
        if lesson.get("storage_path"):
            # Generates a signed URL valid for 1 hour (3600 seconds)
            # Make sure storage_path doesn't include the bucket name if using from_
            path = lesson["storage_path"]
            if path.startswith("course-content/"):
                path = path.replace("course-content/", "", 1)
                
            signed_url = supabase.storage.from_("course-content").create_signed_url(path, 3600)
            data_to_return["signed_url"] = signed_url.get("signedURL")
            
        return jsonify({"success": True, "data": data_to_return})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500
