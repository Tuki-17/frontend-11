"""codigo_compra_en_pedidos

Revision ID: b90b5270de3a
Revises: c1d2e3f4a5b6
Create Date: 2026-11-21 00:32:32.883087

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b90b5270de3a'
down_revision: Union[str, Sequence[str], None] = 'c1d2e3f4a5b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS codigo_compra VARCHAR(50);")
    op.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_pedidos_codigo_compra ON pedidos (codigo_compra);")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP INDEX IF EXISTS ix_pedidos_codigo_compra;")
    op.execute("ALTER TABLE pedidos DROP COLUMN IF EXISTS codigo_compra;")
