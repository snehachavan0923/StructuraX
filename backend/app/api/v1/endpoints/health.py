from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.database import SessionFactory
from app.repositories.health_repository import HealthRepository
from app.schemas.health import HealthResponse
from app.services.engine_service import EngineService
from app.services.health_service import HealthService

router = APIRouter(tags=["health"])

health_service = HealthService(
    repository=HealthRepository(SessionFactory), engine_service=EngineService()
)


def get_health_service() -> HealthService:
    return health_service


@router.get("/health", response_model=HealthResponse)
def get_health(
    service: Annotated[HealthService, Depends(get_health_service)],
) -> HealthResponse:
    return service.check()
