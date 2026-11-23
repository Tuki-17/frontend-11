import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, Query, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, require_admin
from app.schemas import ProductoCreate, ProductoOut, ProductoUpdate
from app.services import productos as productos_service

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=list[ProductoOut])
def listar_productos(
    skip: int = Query(default=0, ge=0, description="Registros a saltar (offset)"),
    limit: int = Query(default=10, ge=1, le=500, description="Maximo de resultados"),
    nombre: str | None = Query(default=None, description="Filtrar por nombre parcial (case-insensitive)"),
    precio_max: float | None = Query(default=None, ge=0, description="Precio maximo inclusive"),
    db: Session = Depends(get_db),
):
    todos = productos_service.listar_productos(db, skip, limit, nombre, precio_max)
    # Filtra los productos eliminados para que no aparezcan en la tienda ni al recargar
    return [p for p in todos if not p.nombre.startswith("[Eliminado]")]


@router.post("/", response_model=ProductoOut, status_code=201)
def crear_producto(
    producto: ProductoCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    """Crea un producto nuevo. Requiere rol admin."""
    return productos_service.crear_producto(db, producto)


@router.put("/{producto_id}", response_model=ProductoOut)
def actualizar_producto(
    producto_id: int,
    producto_update: ProductoUpdate,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    """Actualiza un producto existente. Requiere rol admin."""
    producto = productos_service.actualizar_producto(db, producto_id, producto_update)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@router.delete("/{producto_id}")
def eliminar_producto(
    producto_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    """Elimina un producto existente. Requiere rol admin."""
    eliminado = productos_service.eliminar_producto(db, producto_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"mensaje": "Producto eliminado exitosamente.", "id": producto_id}


@router.post("/{producto_id}/imagen", status_code=201)
def subir_imagen(
    producto_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    """Sube una imagen validando magic bytes."""
    header = file.file.read(4)
    file.file.seek(0)
    # JPG: ff d8 ff
    # PNG: 89 50 4e 47
    if header.startswith(b'\xff\xd8\xff'):
        ext = ".jpg"
    elif header.startswith(b'\x89PNG'):
        ext = ".png"
    else:
        raise HTTPException(400, "Archivo trampa detectado. Solo se permiten archivos JPG o PNG reales.")
    filename = f"{uuid.uuid4().hex}{ext}"
    return {"mensaje": "Imagen subida correctamente.", "filename": filename}
