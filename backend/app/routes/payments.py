from flask import Blueprint, jsonify, request, g
import os
from app.utils.supabase_client import supabase
from app.middleware.auth import require_auth
from app.config import config
import razorpay
import hmac
import hashlib

payments_bp = Blueprint('payments', __name__)

def is_payments_enabled():
    config_name = os.getenv('FLASK_CONFIG', 'default')
    return config[config_name].PAYMENTS_ENABLED

def get_razorpay_client():
    key_id = os.getenv('RAZORPAY_KEY_ID')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET')
    if key_id and key_secret:
        return razorpay.Client(auth=(key_id, key_secret))
    return None

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
        
        # Call Razorpay SDK
        client = get_razorpay_client()
        if not client:
            return jsonify({"success": False, "error": {"code": "CONFIG_ERROR", "message": "Razorpay keys missing"}}), 500
            
        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": f"rcpt_{str(course_id)[:8]}_{str(g.user.id)[:8]}",
            "notes": {
                "course_id": course_id,
                "user_id": g.user.id
            }
        }
        order = client.order.create(data=order_data)
        
        # Save pending purchase to db
        supabase.table("purchases").insert({
            "user_id": g.user.id,
            "course_id": course_id,
            "provider": "razorpay",
            "provider_order_id": order['id'],
            "amount_paise": amount_paise,
            "currency": "INR",
            "status": "pending"
        }).execute()
        
        return jsonify({
            "success": True,
            "data": {
                "provider_order_id": order['id'],
                "amount_paise": amount_paise,
                "currency": "INR"
            }
        })
    except Exception as e:
        print("Create order error:", str(e))
        return jsonify({"success": False, "error": {"code": "SERVER_ERROR", "message": f"Failed to create order: {str(e)}"}}), 500

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
        
    secret = os.getenv('RAZORPAY_WEBHOOK_SECRET', '')
    signature = request.headers.get('X-Razorpay-Signature')
    
    try:
        client = get_razorpay_client()
        client.utility.verify_webhook_signature(request.data.decode('utf-8'), signature, secret)
    except Exception as e:
        return jsonify({"success": False, "message": "Invalid signature"}), 400
        
    data = request.json
    if data['event'] == 'order.paid':
        payload = data['payload']['order']['entity']
        order_id = payload['id']
        notes = payload.get('notes', {})
        course_id = notes.get('course_id')
        user_id = notes.get('user_id')
        
        if course_id and user_id:
            # Update purchase
            supabase.table("purchases").update({"status": "completed"}).eq("provider_order_id", order_id).execute()
            # Grant enrollment if not exists
            existing = supabase.table("enrollments").select("*").eq("user_id", user_id).eq("course_id", course_id).execute()
            if not existing.data:
                supabase.table("enrollments").insert({
                    "user_id": user_id,
                    "course_id": course_id
                }).execute()
    
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
