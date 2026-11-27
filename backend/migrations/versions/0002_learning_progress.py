"""Add topic_progress and execution_logs tables

Revision ID: 0002
Revises: 0001
Create Date: 2026-11-25

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "topic_progress",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("topic_id", sa.String(length=50), nullable=False),
        sa.Column("concepts_viewed", sa.Boolean(), nullable=False, default=False),
        sa.Column(
            "operations_explored",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            default=list,
        ),
        sa.Column("interactive_attempts", sa.Integer(), nullable=False, default=0),
        sa.Column("predictions_answered", sa.Integer(), nullable=False, default=0),
        sa.Column("debugging_completed", sa.Integer(), nullable=False, default=0),
        sa.Column("quiz_score", sa.Integer(), nullable=False, default=0),
        sa.Column("quiz_total", sa.Integer(), nullable=False, default=0),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name="pk_topic_progress"),
    )
    op.create_index("ix_topic_progress_topic_id", "topic_progress", ["topic_id"], unique=True)

    op.create_table(
        "execution_logs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("topic_id", sa.String(length=50), nullable=False),
        sa.Column("operation", sa.String(length=50), nullable=False),
        sa.Column(
            "input_state",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            default=dict,
        ),
        sa.Column(
            "output_state",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            default=dict,
        ),
        sa.Column("event_count", sa.Integer(), nullable=False, default=0),
        sa.Column("is_valid", sa.Boolean(), nullable=False, default=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name="pk_execution_logs"),
    )
    op.create_index("ix_execution_logs_topic_id", "execution_logs", ["topic_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_execution_logs_topic_id", table_name="execution_logs")
    op.drop_table("execution_logs")
    op.drop_index("ix_topic_progress_topic_id", table_name="topic_progress")
    op.drop_table("topic_progress")
