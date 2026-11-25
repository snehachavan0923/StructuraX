import json

import pytest
from app.core.exceptions import EngineBridgeError
from app.engine_bridge.cffi_bridge.engine import get_ffi
from app.engine_bridge.engine_loader.loader import load_engine
from app.engine_bridge.trace_parser.parser import parse_trace


def test_parser_accepts_engine_trace() -> None:
    ffi = get_ffi()
    handle = load_engine()
    pointer = handle.library.structurax_test_operation(7, 5)
    raw_json = ffi.string(pointer).decode("utf-8")
    handle.library.structurax_free_string(pointer)

    trace = parse_trace(raw_json)
    assert trace.final_state["sum"] == 12


def test_parser_rejects_unknown_schema_version() -> None:
    with pytest.raises(EngineBridgeError):
        parse_trace(json.dumps({"schema_version": "2.0.0"}))


def test_parser_rejects_non_monotonic_steps() -> None:
    payload = {
        "schema_version": "1.0.0",
        "operation_id": "bad-trace",
        "operation": "TEST_ADD",
        "initial_state": {},
        "final_state": {},
        "events": [
            {"step": 2, "event_type": "VISIT_NODE"},
            {"step": 1, "event_type": "VISIT_NODE"},
        ],
        "validation": {"valid": True},
        "counters": {},
    }
    with pytest.raises(EngineBridgeError):
        parse_trace(json.dumps(payload))
