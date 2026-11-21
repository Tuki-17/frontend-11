from tests.ayudantes import registrar


def test_registro_rechaza_sin_consentimiento(client):
    """Verifica rechazo HTTP 422 si acepto_tratamiento es False (Ley 25.326)."""
    response = client.post(
        "/auth/register",
        json={
            "nombre": "Usuario Sin Consentimiento",
            "email": "sin_consentimiento@prueba.com",
            "password": "clave-segura-123",
            "acepto_tratamiento": False,
        },
    )
    assert response.status_code == 422


def test_login_clave_incorrecta(client):
    """Verifica error HTTP 401 en login con clave incorrecta."""
    registrar(client, email="cliente_login@prueba.com", password="clave-correcta-123")
    response = client.post(
        "/auth/login",
        data={"username": "cliente_login@prueba.com", "password": "clave-erronea-999"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Credenciales inválidas."
