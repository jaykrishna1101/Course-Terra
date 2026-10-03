import os
from dotenv import load_dotenv
from app import create_app

load_dotenv()

config_name = os.getenv('FLASK_CONFIG', 'default')
app = create_app(config_name)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
