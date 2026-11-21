from tests.ayudantes import cuerpo_pedido


def test_arrepentimiento_sin_autorizacion(client, cliente, producto):
    """Hace petición POST a /arrepentimiento SIN cabeceras de autorización y confirma que devuelve codigo_tramite."""
    # 1. Crear una compra previa para disponer de un código de compra válido
    res_compra = client.post(
        "/pedidos/checkout",
        json=cuerpo_pedido(producto_id=producto.id, cantidad=1),
    )
    assert res_compra.status_code in (200, 201), res_compra.text
    codigo_compra = res_compra.json()["codigo_compra"]

    # 2. Enviar revocación SIN cabecera Authorization (acceso público según Res. 424/2020)
    res_arrepentimiento = client.post(
        "/arrepentimiento",
        json={
            "email": cliente["email"],
            "codigo_compra": codigo_compra,
            "detalle": "Revocación dentro del plazo de 10 días",
        },
    )
    assert res_arrepentimiento.status_code == 200, res_arrepentimiento.text
    data = res_arrepentimiento.json()
    assert "codigo_tramite" in data
    assert data["codigo_tramite"] is not None
    assert str(data["codigo_tramite"]).startswith("REV-")
