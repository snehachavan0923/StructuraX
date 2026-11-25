from datetime import UTC, datetime

from app.repositories.health_repository import HealthRepository
from app.schemas.health import ComponentReport, ComponentStatus, HealthResponse
from app.services.engine_service import EngineService


class HealthService:
    def __init__(
        self, repository: HealthRepository, engine_service: EngineService
    ) -> None:
        self.repository = repository
        self.engine_service = engine_service

    def check(self) -> HealthResponse:
        database_ok, database_detail = self.repository.check_database()
        database = ComponentReport(
            status=(
                ComponentStatus.HEALTHY if database_ok else ComponentStatus.DEGRADED
            ),
            detail=database_detail,
        )
        engine = self.engine_service.describe()
        overall = (
            ComponentStatus.HEALTHY
            if database.status == ComponentStatus.HEALTHY
            and engine.status == ComponentStatus.HEALTHY
            else ComponentStatus.DEGRADED
        )
        return HealthResponse(
            status=overall,
            api=ComponentStatus.HEALTHY,
            database=database,
            engine=engine,
            checked_at=datetime.now(UTC),
        )
