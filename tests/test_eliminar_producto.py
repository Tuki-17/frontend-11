def test_eliminar_producto_admin(client, admin, producto):
    """Verifica que un usuario con rol admin puede eliminar un producto."""
    res = client.delete(f"/productos/{producto.id}", headers=admin["headers"])
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["id"] == producto.id

    # Verificar que ya no existe (o no se puede obtener/eliminar de nuevo)
    res_get = client.delete(f"/productos/{producto.id}", headers=admin["headers"])
    assert res_get.status_code == 404


def test_eliminar_producto_cliente_denegado(client, cliente, producto):
    """Verifica que un cliente sin rol admin recibe 403 al intentar eliminar."""
    res = client.delete(f"/productos/{producto.id}", headers=cliente["headers"])
    assert res.status_code == 403


def test_eliminar_producto_sin_autenticacion(client, producto):
    """Verifica que sin token se rechaza la petición con 401."""
    res = client.delete(f"/productos/{producto.id}")
    assert res.status_code == 401
