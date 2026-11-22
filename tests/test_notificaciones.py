from tests.ayudantes import cuerpo_pedido


def test_notificaciones_requiere_autenticacion(client):
    """Verifica que sin token se rechaza la petición con 401."""
    res = client.get("/notificaciones")
    assert res.status_code == 401


def test_notificaciones_cliente(client, cliente, producto):
    """Verifica que un cliente ve sus notificaciones de pedidos."""
    # 1. Crear un pedido para el cliente
    res_compra = client.post(
        "/pedidos/checkout",
        json=cuerpo_pedido(producto_id=producto.id, cantidad=1),
    )
    assert res_compra.status_code in (200, 201), res_compra.text
    codigo_compra = res_compra.json()["codigo_compra"]

    # 2. Consultar notificaciones como cliente
    res = client.get("/notificaciones", headers=cliente["headers"])
    assert res.status_code == 200, res.text
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    codigos = [n["codigo_compra"] for n in data]
    assert codigo_compra in codigos
    # Título para cliente
    notif = next(n for n in data if n["codigo_compra"] == codigo_compra)
    assert "confirmada" in notif["titulo"].lower()


def test_notificaciones_admin(client, admin, cliente, producto):
    """Verifica que el admin ve todas las notificaciones recientes con estado."""
    # 1. Crear pedido con cliente
    res_compra = client.post(
        "/pedidos/checkout",
        json=cuerpo_pedido(producto_id=producto.id, cantidad=1),
    )
    codigo_compra = res_compra.json()["codigo_compra"]

    # 2. Consultar notificaciones como admin
    res = client.get("/notificaciones", headers=admin["headers"])
    assert res.status_code == 200, res.text
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    notif = next(n for n in data if n["codigo_compra"] == codigo_compra)
    assert "Nuevo pedido" in notif["titulo"]
    assert cliente["email"] in notif["titulo"] or cliente["email"] in notif["email"]
