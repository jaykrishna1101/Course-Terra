from flask import Blueprint, jsonify, g
from app.utils.supabase_client import supabase
from app.middleware.auth import require_auth

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/', methods=['GET'])
@require_auth
def get_me():
    try:
        profile = supabase.table("profiles").select("*").eq("id", g.user.id).single().execute()
        return jsonify({"success": True, "data": profile.data})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500

@auth_bp.route('/courses', methods=['GET'])
@require_auth
def get_my_courses():
    try:
        enrollments = supabase.table("enrollments").select("course_id, enrolled_at, courses(*)").eq("user_id", g.user.id).eq("status", "active").execute()
        return jsonify({"success": True, "data": enrollments.data})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500
