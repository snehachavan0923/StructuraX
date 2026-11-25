from functools import lru_cache
from pathlib import Path

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_ROOT = Path(__file__).resolve().parents[3]
_BACKEND = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(_ROOT / ".env", _BACKEND / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    environment: str = "development"
    debug: bool = True
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    api_prefix: str = "/api/v1"

    postgres_user: str = "structurax"
    postgres_password: str = ""
    postgres_host: str = "127.0.0.1"
    postgres_port: int = 5432
    postgres_db: str = "structurax_dev"
    database_url: str | None = None

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    jwt_secret: str = ""
    ai_provider_api_key: str = ""

    dsa_engine_library_path: str | None = None

    @model_validator(mode="after")
    def resolve_secrets_and_database_url(self) -> "Settings":
        if not self.postgres_password:
            raise ValueError("POSTGRES_PASSWORD must be set in the environment")
        if not self.jwt_secret:
            raise ValueError("JWT_SECRET must be set in the environment")
        if self.database_url is None:
            self.database_url = (
                f"postgresql+psycopg://{self.postgres_user}:{self.postgres_password}"
                f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
            )
        return self

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
