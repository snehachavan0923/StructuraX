from app.engine_bridge.engine_loader.loader import (
    load_engine,
    resolve_library_path,
)
from app.services.engine_service import EngineService


def test_engine_library_is_discovered() -> None:
    assert resolve_library_path() is not None
    handle = load_engine()
    assert handle.path.is_file()
    assert handle.library.structurax_engine_is_initialized() == 1


def test_engine_test_operation_returns_valid_trace() -> None:
    trace = EngineService().run_test_operation(2, 3)

    assert trace.schema_version == "1.0.0"
    assert trace.operation == "TEST_ADD"
    assert trace.initial_state == {"left": 2, "right": 3}
    assert trace.final_state == {"sum": 5}
    assert [event.step for event in trace.events] == [1, 2, 3]
    assert trace.validation.valid is True
