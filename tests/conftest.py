import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base
from app.dependencies import get_db
from app.models import Usuario, Producto
from app.core.security import hash_password
from tests.ayudantes import registrar, token_de

TEST_DATABASE_URL = "sqlite://"

engine_test = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def cliente(client):
    email, password = registrar(client, email="cliente@prueba.com", password="clave-larga-123")
    return {
        "email": email,
        "password": password,
        "headers": token_de(client, email, password),
    }


@pytest.fixture
def admin(db_session, client):
    admin_user = Usuario(
        nombre="Admin de Prueba",
        email="admin@prueba.com",
        hashed_password=hash_password("admin-clave-123"),
        rol="admin",
        acepto_tratamiento=True,
    )
    db_session.add(admin_user)
    db_session.commit()
    db_session.refresh(admin_user)
    return {
        "usuario": admin_user,
        "email": "admin@prueba.com",
        "password": "admin-clave-123",
        "headers": token_de(client, "admin@prueba.com", "admin-clave-123"),
    }


@pytest.fixture
def producto(db_session):
    prod = Producto(
        nombre="Tarta de Frutas Ilusión",
        precio_final=8500.0,
        cuotas_cantidad=3,
        cuotas_valor=2833.33,
        garantia_meses=0,
        stock=10,
        descripcion="Pastelería trampantojo de prueba",
    )
    db_session.add(prod)
    db_session.commit()
    db_session.refresh(prod)
    return prod
