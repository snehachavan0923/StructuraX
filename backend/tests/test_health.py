from app.schemas.health import ComponentStatus


def test_health_reports_real_component_statuses(client) -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == ComponentStatus.HEALTHY.value
    assert body["api"] == ComponentStatus.HEALTHY.value
    assert body["database"]["status"] == ComponentStatus.HEALTHY.value
    assert body["engine"]["status"] == ComponentStatus.HEALTHY.value
    assert body["engine"]["version"] == "0.1.0"
    assert "checked_at" in body
