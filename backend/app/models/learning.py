import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class TopicProgress(Base):
    __tablename__ = "topic_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    concepts_viewed: Mapped[bool] = mapped_column(Boolean, default=False)
    operations_explored: Mapped[list[str]] = mapped_column(JSONB, default=list)
    interactive_attempts: Mapped[int] = mapped_column(Integer, default=0)
    predictions_answered: Mapped[int] = mapped_column(Integer, default=0)
    debugging_completed: Mapped[int] = mapped_column(Integer, default=0)
    quiz_score: Mapped[int] = mapped_column(Integer, default=0)
    quiz_total: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class ExecutionLog(Base):
    __tablename__ = "execution_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_id: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    operation: Mapped[str] = mapped_column(String(50), nullable=False)
    input_state: Mapped[dict] = mapped_column(JSONB, default=dict)
    output_state: Mapped[dict] = mapped_column(JSONB, default=dict)
    event_count: Mapped[int] = mapped_column(Integer, default=0)
    is_valid: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
