import json

from app.core.exceptions import EngineBridgeError
from app.engine_bridge.cffi_bridge.engine import get_ffi
from app.engine_bridge.engine_loader.loader import EngineHandle
from app.schemas.trace import ExecutionTrace


def parse_trace(raw_json: str) -> ExecutionTrace:
    try:
        payload = json.loads(raw_json)
    except json.JSONDecodeError as exc:
        raise EngineBridgeError("C engine returned invalid JSON trace") from exc
    try:
        return ExecutionTrace.model_validate(payload)
    except ValueError as exc:
        raise EngineBridgeError(f"C engine trace failed schema validation: {exc}") from exc


def call_test_operation(handle: EngineHandle, left: int, right: int) -> ExecutionTrace:
    ffi = get_ffi()
    raw_pointer = handle.library.structurax_test_operation(left, right)
    if raw_pointer == ffi.NULL:
        raise EngineBridgeError("C engine failed to allocate the trace")
    try:
        raw_json = ffi.string(raw_pointer).decode("utf-8")
    finally:
        handle.library.structurax_free_string(raw_pointer)
    return parse_trace(raw_json)
