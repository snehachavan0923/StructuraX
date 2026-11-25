from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel


class ComponentStatus(StrEnum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"


class ComponentReport(BaseModel):
    status: ComponentStatus
    detail: str
    version: str | None = None


class HealthResponse(BaseModel):
    status: ComponentStatus
    api: ComponentStatus
    database: ComponentReport
    engine: ComponentReport
    checked_at: datetime
