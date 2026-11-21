from tests.ayudantes import cuerpo_pedido


def test_pedido_stock_insuficiente_y_rollback(client, cliente, producto, db_session):
    """Intenta pedir más stock del disponible, valida error HTTP (400 o 409) y confirma rollback."""
    stock_original = producto.stock

    # Intentar comprar más stock del que existe
    payload = cuerpo_pedido(producto_id=producto.id, cantidad=stock_original + 10)
    response = client.post("/pedidos/checkout", json=payload)

    # Valida error HTTP (400 o 409)
    assert response.status_code in (400, 409), response.text

    # Confirma rollback: el stock del producto sigue intacto
    db_session.refresh(producto)
    assert producto.stock == stock_original
