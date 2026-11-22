import React, { useState } from 'react';
import { createProducto, updateProducto, deleteProducto } from '../services/api';
import toast from 'react-hot-toast';

export const AdminPanel = ({ productos, setProductos, token }) => {
  const [editingId, setEditingId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    precio_final: 0,
    cuotas_cantidad: 3,
    cuotas_valor: 0,
    garantia_meses: 6,
    stock: 0,
    imagen_url: '',
    descripcion: ''
  });

  const [loading, setLoading] = useState(false);

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setFormData({
      nombre: prod.nombre,
      precio_final: prod.precio_final,
      cuotas_cantidad: prod.cuotas_cantidad,
      cuotas_valor: prod.cuotas_valor,
      garantia_meses: prod.garantia_meses,
      stock: prod.stock,
      imagen_url: prod.imagen_url || '',
      descripcion: prod.descripcion || ''
    });
  };

  const handleNew = () => {
    setEditingId('new');
    setFormData({
      nombre: '',
      precio_final: 0,
      cuotas_cantidad: 3,
      cuotas_valor: 0,
      garantia_meses: 6,
      stock: 0,
      imagen_url: '',
      descripcion: ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: ['precio_final', 'cuotas_cantidad', 'cuotas_valor', 'garantia_meses', 'stock'].includes(name) ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId === 'new') {
        const newProd = await createProducto(token, formData);
        setProductos([...productos, newProd]);
        toast.success("Producto creado!");
      } else {
        const updated = await updateProducto(token, editingId, formData);
        setProductos(productos.map(p => p.id === editingId ? updated : p));
        toast.success("Producto actualizado!");
      }
      setEditingId(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteProducto(token, productToDelete.id);
      setProductos(productos.filter(p => p.id !== productToDelete.id));
      toast.success("Producto eliminado exitosamente");
      setProductToDelete(null);
    } catch (error) {
      toast.error(error.message || "Error al eliminar producto");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Gestión de Productos</h3>
        <button className="btn btn-primary" onClick={handleNew}>+ Agregar Producto</button>
      </div>

      {editingId && (
        <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
          <h4>{editingId === 'new' ? 'Nuevo Producto' : 'Editar Producto'}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <div><label>Nombre:</label><input name="nombre" value={formData.nombre} onChange={handleChange} className="form-input" required /></div>
            <div><label>Precio Final:</label><input type="number" name="precio_final" value={formData.precio_final} onChange={handleChange} className="form-input" required /></div>
            <div><label>Stock:</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} className="form-input" required /></div>
            <div><label>Imagen URL:</label><input name="imagen_url" value={formData.imagen_url} onChange={handleChange} className="form-input" /></div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Descripción:</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-input" rows="3"></textarea>
          </div>
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>Guardar</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
          </div>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Nombre</th>
            <th style={{ padding: '8px' }}>Precio</th>
            <th style={{ padding: '8px' }}>Stock</th>
            <th style={{ padding: '8px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{p.nombre}</td>
              <td style={{ padding: '8px' }}>${p.precio_final}</td>
              <td style={{ padding: '8px' }}>{p.stock}</td>
              <td style={{ padding: '8px' }}>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', marginRight: '6px' }} onClick={() => handleEdit(p)}>✏️ Editar</button>
                <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setProductToDelete(p)}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {productToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#1f2937' }}>Confirmar Eliminación</h4>
            <p style={{ margin: '0 0 20px 0', color: '#4b5563' }}>
              ¿Estás seguro de que deseas eliminar el producto <strong>{productToDelete.nombre}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={deleteLoading}
                onClick={() => setProductToDelete(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
              >
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
