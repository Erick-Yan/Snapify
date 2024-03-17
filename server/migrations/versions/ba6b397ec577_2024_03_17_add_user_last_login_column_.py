"""2024-03-17_add_user_last_login_column_to_user_table

Revision ID: ba6b397ec577
Revises: 
Create Date: 2024-03-17 00:22:54.527773

"""

from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = "ba6b397ec577"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("user_last_login", sa.DateTime(), default=datetime.now())
        )
    # Update existing rows to populate the new column with default value
    op.execute("UPDATE users SET user_last_login = NOW()")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_column("user_last_login")

    # ### end Alembic commands ###