from functools import wraps
from flask import request, jsonify, g
from app.utils.supabase_client import supabase

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"success": False, "error": {"code": "UNAUTHORIZED", "message": "Missing or invalid token"}}), 401
        
        token = auth_header.split(" ")[1]
        try:
            user_response = supabase.auth.get_user(token)
            if not user_response or not user_response.user:
                raise Exception("Invalid user")
            g.user = user_response.user
        except Exception as e:
            return jsonify({"success": False, "error": {"code": "UNAUTHORIZED", "message": "Invalid token"}}), 401
        
        return f(*args, **kwargs)
    return decorated

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Must be called after require_auth, so g.user should exist
        if not hasattr(g, 'user'):
            return jsonify({"success": False, "error": {"code": "UNAUTHORIZED", "message": "Authentication required"}}), 401
        
        try:
            # Check if user role is admin in profiles table
            profile_res = supabase.table("profiles").select("role").eq("id", g.user.id).single().execute()
            if not profile_res.data or profile_res.data.get("role") != "admin":
                return jsonify({"success": False, "error": {"code": "FORBIDDEN", "message": "Admin access required"}}), 403
        except Exception as e:
            return jsonify({"success": False, "error": {"code": "SERVER_ERROR", "message": "Failed to verify admin status"}}), 500

        return f(*args, **kwargs)
    return decorated
