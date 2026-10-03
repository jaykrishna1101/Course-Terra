from flask import Blueprint, jsonify, request
from app.utils.supabase_client import supabase
from app.middleware.auth import require_auth, require_admin

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/', methods=['GET'])
def get_courses():
    try:
        response = supabase.table("courses").select("*").eq("status", "published").execute()
        return jsonify({"success": True, "data": response.data})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500

@courses_bp.route('/<slug>', methods=['GET'])
def get_course_by_slug(slug):
    try:
        response = supabase.table("courses").select("*").eq("slug", slug).eq("status", "published").single().execute()
        if not response.data:
            return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Course not found"}}), 404
            
        course = response.data
        
        # Fetch modules and lessons (metadata only)
        modules_res = supabase.table("course_modules").select("*, lessons(id, title, lesson_type, sort_order, is_preview)").eq("course_id", course['id']).order("sort_order").execute()
        course['modules'] = modules_res.data
        
        return jsonify({"success": True, "data": course})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500

@courses_bp.route('/<course_id>/access', methods=['GET'])
@require_auth
def check_course_access(course_id):
    from flask import g
    try:
        # If user is admin, always allow
        profile_res = supabase.table("profiles").select("role").eq("id", g.user.id).single().execute()
        if profile_res.data and profile_res.data.get('role') == 'admin':
            return jsonify({"success": True, "data": {"has_access": True}})
            
        # Check active enrollment
        enrollment = supabase.table("enrollments").select("status").eq("user_id", g.user.id).eq("course_id", course_id).eq("status", "active").execute()
        has_access = len(enrollment.data) > 0
        return jsonify({"success": True, "data": {"has_access": has_access}})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500
