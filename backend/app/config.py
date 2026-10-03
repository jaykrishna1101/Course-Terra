import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    PAYMENTS_ENABLED = os.environ.get('PAYMENTS_ENABLED', 'false').lower() == 'true'
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')
    RAZORPAY_WEBHOOK_SECRET = os.environ.get('RAZORPAY_WEBHOOK_SECRET')
    MOCK_PAYMENTS_ENABLED = os.environ.get('MOCK_PAYMENTS_ENABLED', 'false').lower() == 'true'

class DevelopmentConfig(Config):
    DEBUG = True
    FRONTEND_URL = 'http://localhost:5173'

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
