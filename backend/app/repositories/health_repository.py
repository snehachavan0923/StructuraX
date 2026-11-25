from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker


class HealthRepository:
    def __init__(self, session_factory: sessionmaker) -> None:
        self.session_factory = session_factory

    def check_database(self) -> tuple[bool, str]:
        try:
            with self.session_factory() as session:
                session.execute(text("SELECT 1"))
        except SQLAlchemyError as exc:
            return False, f"database check failed: {type(exc).__name__}"
        return True, "postgresql connection established"
