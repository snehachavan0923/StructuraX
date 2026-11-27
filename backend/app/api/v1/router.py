from fastapi import APIRouter

from app.api.v1.endpoints import execution, health

router = APIRouter()
router.include_router(health.router)
router.include_router(execution.router)
