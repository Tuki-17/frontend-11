"""agregar imagen_url y descripcion a productos

Revision ID: c1d2e3f4a5b6
Revises: bfc586aecf3a
Create Date: 2026-11-16 20:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1d2e3f4a5b6'
down_revision: Union[str, Sequence[str], None] = 'bfc586aecf3a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('productos', sa.Column('imagen_url', sa.String(), nullable=True))
    op.add_column('productos', sa.Column('descripcion', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('productos', 'descripcion')
    op.drop_column('productos', 'imagen_url')
