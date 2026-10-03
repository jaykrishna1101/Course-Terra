from flask import Blueprint, jsonify, request, g
from app.utils.supabase_client import supabase
from app.middleware.auth import require_auth, require_admin

admin_bp = Blueprint('admin', __name__)

# Courses
@admin_bp.route('/courses', methods=['POST'])
@require_auth
@require_admin
def create_course():
    data = request.json
    try:
        data['created_by'] = g.user.id
        res = supabase.table("courses").insert(data).execute()
        return jsonify({"success": True, "data": res.data[0]}), 201
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500

@admin_bp.route('/courses/<course_id>', methods=['PATCH'])
@require_auth
@require_admin
def update_course(course_id):
    data = request.json
    try:
        res = supabase.table("courses").update(data).eq("id", course_id).execute()
        return jsonify({"success": True, "data": res.data[0]})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500

@admin_bp.route('/courses/<course_id>', methods=['DELETE'])
@require_auth
@require_admin
def delete_course(course_id):
    try:
        supabase.table("courses").delete().eq("id", course_id).execute()
        return jsonify({"success": True, "data": None})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500

# Modules
@admin_bp.route('/courses/<course_id>/modules', methods=['POST'])
@require_auth
@require_admin
def create_module(course_id):
    data = request.json
    data['course_id'] = course_id
    try:
        res = supabase.table("course_modules").insert(data).execute()
        return jsonify({"success": True, "data": res.data[0]}), 201
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500

@admin_bp.route('/modules/<module_id>', methods=['PATCH', 'DELETE'])
@require_auth
@require_admin
def manage_module(module_id):
    try:
        if request.method == 'PATCH':
            res = supabase.table("course_modules").update(request.json).eq("id", module_id).execute()
            return jsonify({"success": True, "data": res.data[0]})
        elif request.method == 'DELETE':
            supabase.table("course_modules").delete().eq("id", module_id).execute()
            return jsonify({"success": True, "data": None})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500

# Lessons
@admin_bp.route('/modules/<module_id>/lessons', methods=['POST'])
@require_auth
@require_admin
def create_lesson(module_id):
    data = request.json
    data['module_id'] = module_id
    try:
        res = supabase.table("lessons").insert(data).execute()
        return jsonify({"success": True, "data": res.data[0]}), 201
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500

@admin_bp.route('/lessons/<lesson_id>', methods=['PATCH', 'DELETE'])
@require_auth
@require_admin
def manage_lesson(lesson_id):
    try:
        if request.method == 'PATCH':
            res = supabase.table("lessons").update(request.json).eq("id", lesson_id).execute()
            return jsonify({"success": True, "data": res.data[0]})
        elif request.method == 'DELETE':
            supabase.table("lessons").delete().eq("id", lesson_id).execute()
            return jsonify({"success": True, "data": None})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500
