"""usuarios con auth

Revision ID: bfc586aecf3a
Revises: f0a65b947021
Create Date: 2026-09-22 13:39:24.480365

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bfc586aecf3a'
down_revision: Union[str, Sequence[str], None] = 'f0a65b947021'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        'usuarios',
        'password_hash',
        new_column_name='hashed_password',
        existing_type=sa.String(),
        nullable=False,
    )
    op.add_column(
        'usuarios',
        sa.Column('acepto_tratamiento', sa.Boolean(), nullable=False, server_default='false'),
    )
    op.add_column(
        'usuarios',
        sa.Column('fecha_consentimiento', sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('usuarios', 'fecha_consentimiento')
    op.drop_column('usuarios', 'acepto_tratamiento')
    op.alter_column(
        'usuarios',
        'hashed_password',
        new_column_name='password_hash',
        existing_type=sa.String(),
        nullable=False,
    )
