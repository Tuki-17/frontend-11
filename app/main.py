import uuid
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app.dependencies import get_db
from app.models import Producto as ProductoModel, Pedido, ItemPedido
from app.routers import productos, auth, pedidos

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# Carga inicial de productos (seeding) si la base de datos está vacía
db = SessionLocal()
try:
    if db.query(ProductoModel).count() == 0:
        productos_defecto = [
            ProductoModel(nombre="Hamburguesa (Banana y avena)", precio_final=9500.0, cuotas_cantidad=3, cuotas_valor=3166.67, garantia_meses=0, stock=15),
            ProductoModel(nombre="Esponja (Bizcochuelo)", precio_final=12500.0, cuotas_cantidad=3, cuotas_valor=4166.67, garantia_meses=0, stock=10),
            ProductoModel(nombre="Huevo (Gelatina)", precio_final=6000.0, cuotas_cantidad=1, cuotas_valor=6000.0, garantia_meses=0, stock=20),
            ProductoModel(nombre="Vela (Chocolate blanco y negro)", precio_final=9000.0, cuotas_cantidad=3, cuotas_valor=3000.0, garantia_meses=0, stock=12),
            ProductoModel(nombre="Tomate (Alfajor de maicena)", precio_final=11000.0, cuotas_cantidad=3, cuotas_valor=3666.67, garantia_meses=0, stock=18),
        ]
        db.bulk_save_objects(productos_defecto)
        db.commit()
        print("Base de datos inicializada y poblada con productos por defecto.")
except Exception as e:
    print(f"Error al poblar la base de datos: {e}")
finally:
    db.close()

app = FastAPI(title=settings.PROJECT_NAME)

# Middleware de compresión GZip para respuestas mayores a 1 KB (mejora Lighthouse)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Middleware de CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Clase para servir imágenes con política de caché de 30 días
class StaticConCache(StaticFiles):
    async def get_response(self, path, scope):
        respuesta = await super().get_response(path, scope)
        if respuesta.status_code == 200:
            respuesta.headers["Cache-Control"] = "public, max-age=2592000, immutable"
        return respuesta


Path("uploads/productos").mkdir(parents=True, exist_ok=True)
Path("app/static/demo").mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticConCache(directory="uploads"), name="static")
app.mount("/demo", StaticConCache(directory="app/static/demo"), name="demo")

# Montar los routers
app.include_router(productos.router)
app.include_router(auth.router)
app.include_router(pedidos.router)


# --- Endpoint de arrepentimiento (Resolución 424/2020) ---

class SolicitudArrepentimiento(BaseModel):
    email: str
    codigo_compra: str
    detalle: str | None = None


@app.post("/arrepentimiento")
def registrar_arrepentimiento(solicitud: SolicitudArrepentimiento, db: Session = Depends(get_db)):
    pedido = db.query(Pedido).filter(Pedido.codigo_compra == solicitud.codigo_compra).first()

    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado con ese código de compra.")

    if pedido.usuario.email != solicitud.email:
        raise HTTPException(status_code=400, detail="El correo no coincide con el pedido.")

    if pedido.estado == "CANCELADO":
        raise HTTPException(status_code=400, detail="Este pedido ya se encuentra cancelado.")

    pedido.estado = "CANCELADO"

    for item in pedido.items:
        producto = item.producto
        if producto:
            producto.stock += item.cantidad

    codigo_tramite = f"REV-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"
    db.commit()

    return {
        "mensaje": "Trámite de revocación de compra iniciado con éxito (Resolución 424/2020).",
        "codigo_tramite": codigo_tramite,
        "registro": {
            "email": solicitud.email,
            "codigo_compra": solicitud.codigo_compra,
            "codigo_tramite": codigo_tramite,
            "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
    }


@app.get("/salud")
def salud(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"estado": "ok", "base": "ok"}


@app.get("/")
def raiz():
    return {"status": "ok", "app": settings.PROJECT_NAME}
