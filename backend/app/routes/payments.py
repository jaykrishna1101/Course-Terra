from flask import Blueprint, jsonify, request, g
import os
from app.utils.supabase_client import supabase
from app.middleware.auth import require_auth
from app.config import config

payments_bp = Blueprint('payments', __name__)

def is_payments_enabled():
    config_name = os.getenv('FLASK_CONFIG', 'default')
    return config[config_name].PAYMENTS_ENABLED

@payments_bp.route('/create-order', methods=['POST'])
@require_auth
def create_order():
    if not is_payments_enabled():
        return jsonify({
            "success": False,
            "code": "PAYMENTS_DISABLED",
            "message": "Online payments are currently unavailable. Please check back soon."
        }), 400
        
    data = request.json
    course_id = data.get('course_id')
    
    if not course_id:
        return jsonify({"success": False, "error": {"code": "INVALID_REQUEST", "message": "course_id is required"}}), 400
        
    try:
        # Get course price from DB directly
        course_res = supabase.table("courses").select("price_paise, status").eq("id", course_id).single().execute()
        if not course_res.data or course_res.data['status'] != 'published':
            return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Course not found or unavailable"}}), 404
            
        amount_paise = course_res.data['price_paise']
        
        # In the future: call Razorpay SDK here
        # order = razorpay_client.order.create({"amount": amount_paise, "currency": "INR"})
        
        return jsonify({
            "success": True,
            "data": {
                # "provider_order_id": order['id'],
                "amount_paise": amount_paise,
                "currency": "INR"
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "SERVER_ERROR", "message": "Failed to create order"}}), 500

@payments_bp.route('/verify', methods=['POST'])
@require_auth
def verify_payment():
    if not is_payments_enabled():
        return jsonify({"success": False, "code": "PAYMENTS_DISABLED", "message": "Payments disabled"}), 400
        
    # Future logic: Verify signature, update purchase and enrollment
    return jsonify({"success": False, "code": "NOT_IMPLEMENTED", "message": "Verification not implemented yet"}), 501

@payments_bp.route('/webhook/razorpay', methods=['POST'])
def webhook_razorpay():
    if not is_payments_enabled():
        return jsonify({"success": False, "message": "Payments disabled"}), 400
        
    # Future logic: Verify webhook signature, ensure idempotency, grant access
    return jsonify({"success": True}), 200

@payments_bp.route('/<payment_id>', methods=['GET'])
@require_auth
def get_payment(payment_id):
    try:
        res = supabase.table("purchases").select("*").eq("id", payment_id).single().execute()
        if not res.data:
            return jsonify({"success": False, "error": {"code": "NOT_FOUND", "message": "Payment not found"}}), 404
            
        if res.data['user_id'] != g.user.id:
            return jsonify({"success": False, "error": {"code": "FORBIDDEN", "message": "Access denied"}}), 403
            
        return jsonify({"success": True, "data": res.data})
    except Exception as e:
        return jsonify({"success": False, "error": {"code": "DB_ERROR", "message": str(e)}}), 500
