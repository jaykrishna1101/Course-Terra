import os
import pytest
from app import create_app

@pytest.fixture
def client():
    os.environ['FLASK_CONFIG'] = 'development'
    app = create_app('development')
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    rv = client.get('/api/v1/health')
    assert rv.status_code == 200
    assert rv.json['success'] is True
    assert rv.json['data']['status'] == 'ok'

def test_payments_disabled_response(client):
    rv = client.post('/api/v1/payments/create-order', json={"course_id": "dummy-id"})
    # It might return 400 with PAYMENTS_DISABLED or 401 if unauthenticated, 
    # but we test the structure. Since there is require_auth, it should return 401 Unauthorized first.
    assert rv.status_code == 401
    assert rv.json['success'] is False

def test_unauthorized_access(client):
    rv = client.get('/api/v1/me/')
    assert rv.status_code == 401
    assert rv.json['success'] is False
    assert rv.json['error']['code'] == 'UNAUTHORIZED'

def test_admin_unauthorized_access(client):
    rv = client.post('/api/v1/admin/courses', json={"title": "Test"})
    assert rv.status_code == 401
