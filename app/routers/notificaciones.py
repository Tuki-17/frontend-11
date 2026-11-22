from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.models import Pedido, Usuario

router = APIRouter(prefix="/notificaciones", tags=["Notificaciones"])


@router.get("")
@router.get("/")
def obtener_notificaciones(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    """
    Retorna las notificaciones basadas en pedidos recientes:
    - Admin: todos los pedidos recientes con su estado (realizados, pendientes, cancelados).
    - Cliente: únicamente sus propios pedidos con código de compra y estado actual.
    """
    es_admin = usuario.rol == "admin"

    if es_admin:
        pedidos = db.query(Pedido).order_by(Pedido.id.desc()).limit(30).all()
    else:
        pedidos = (
            db.query(Pedido)
            .filter(Pedido.usuario_id == usuario.id)
            .order_by(Pedido.id.desc())
            .limit(30)
            .all()
        )

    notificaciones = []
    for p in pedidos:
        es_cancelado = p.estado and p.estado.upper() == "CANCELADO"
        email_usuario = p.usuario.email if p.usuario else "cliente"

        if es_admin:
            if es_cancelado:
                titulo = f"Solicitud de arrepentimiento en pedido {p.codigo_compra}"
                mensaje = f"El pedido {p.codigo_compra} de {email_usuario} fue cancelado por arrepentimiento."
            else:
                titulo = f"Nuevo pedido {p.codigo_compra} de {email_usuario}"
                mensaje = f"Pedido registrado por un total de ${p.total:,.2f} ARS. Estado: {p.estado}."
        else:
            if es_cancelado:
                titulo = f"Trámite de arrepentimiento procesado para {p.codigo_compra}"
                mensaje = f"Tu pedido {p.codigo_compra} ha sido cancelado con éxito según Resolución 424/2020."
            else:
                titulo = f"¡Tu compra {p.codigo_compra} ha sido confirmada!"
                mensaje = f"Tu pedido {p.codigo_compra} de ${p.total:,.2f} ARS se encuentra en estado: {p.estado}."

        notificaciones.append({
            "id": f"notif-ped-{p.id}",
            "pedido_id": p.id,
            "codigo_compra": p.codigo_compra,
            "estado": p.estado,
            "total": p.total,
            "email": email_usuario,
            "titulo": titulo,
            "mensaje": mensaje,
            "tipo": "cancelado" if es_cancelado else "confirmado",
        })

    return notificaciones
