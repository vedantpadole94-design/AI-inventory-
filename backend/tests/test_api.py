import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_dashboard_analytics():
    response = client.get("/api/analytics/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "total_spend" in data
    assert "active_suppliers" in data

def test_copilot_chat():
    response = client.post(
        "/api/copilot/chat",
        json={"message": "What is our total spend?", "context": {}}
    )
    assert response.status_code == 200
    assert "reply" in response.json()
