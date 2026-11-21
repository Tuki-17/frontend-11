def test_salud(client):
    response = client.get("/salud")
    assert response.status_code == 200
    assert response.json() == {"estado": "ok", "base": "ok"}
