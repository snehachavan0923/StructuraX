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


def call_sll_operation(
    handle: EngineHandle,
    initial_values: list[int],
    operation_type: int,
    value: int,
    position: int,
) -> ExecutionTrace:
    ffi = get_ffi()
    c_arr = ffi.new(f"int[{len(initial_values)}]", initial_values) if initial_values else ffi.NULL
    raw_pointer = handle.library.structurax_sll_execute(
        c_arr,
        len(initial_values),
        operation_type,
        value,
        position,
    )
    if raw_pointer == ffi.NULL:
        raise EngineBridgeError("C engine failed to execute singly linked list operation")
    try:
        raw_json = ffi.string(raw_pointer).decode("utf-8")
    finally:
        handle.library.structurax_free_string(raw_pointer)
    return parse_trace(raw_json)


def call_dll_operation(
    handle: EngineHandle,
    initial_values: list[int],
    operation_type: int,
    value: int,
    position: int,
    target_value: int,
) -> ExecutionTrace:
    ffi = get_ffi()
    c_arr = ffi.new(f"int[{len(initial_values)}]", initial_values) if initial_values else ffi.NULL
    raw_pointer = handle.library.structurax_dll_execute(
        c_arr,
        len(initial_values),
        operation_type,
        value,
        position,
        target_value,
    )
    if raw_pointer == ffi.NULL:
        raise EngineBridgeError("C engine failed to execute doubly linked list operation")
    try:
        raw_json = ffi.string(raw_pointer).decode("utf-8")
    finally:
        handle.library.structurax_free_string(raw_pointer)
    return parse_trace(raw_json)


def call_cll_operation(
    handle: EngineHandle,
    initial_values: list[int],
    operation_type: int,
    value: int,
    position: int,
) -> ExecutionTrace:
    ffi = get_ffi()
    c_arr = ffi.new(f"int[{len(initial_values)}]", initial_values) if initial_values else ffi.NULL
    raw_pointer = handle.library.structurax_cll_execute(
        c_arr,
        len(initial_values),
        operation_type,
        value,
        position,
    )
    if raw_pointer == ffi.NULL:
        raise EngineBridgeError("C engine failed to execute circular linked list operation")
    try:
        raw_json = ffi.string(raw_pointer).decode("utf-8")
    finally:
        handle.library.structurax_free_string(raw_pointer)
    return parse_trace(raw_json)


def call_poly_operation(
    handle: EngineHandle,
    coeffs1: list[int],
    exps1: list[int],
    coeffs2: list[int],
    exps2: list[int],
    operation_type: int,
) -> ExecutionTrace:
    ffi = get_ffi()
    c1 = ffi.new(f"int[{len(coeffs1)}]", coeffs1) if coeffs1 else ffi.NULL
    e1 = ffi.new(f"int[{len(exps1)}]", exps1) if exps1 else ffi.NULL
    c2 = ffi.new(f"int[{len(coeffs2)}]", coeffs2) if coeffs2 else ffi.NULL
    e2 = ffi.new(f"int[{len(exps2)}]", exps2) if exps2 else ffi.NULL

    raw_pointer = handle.library.structurax_poly_execute(
        c1,
        e1,
        len(coeffs1),
        c2,
        e2,
        len(coeffs2),
        operation_type,
    )
    if raw_pointer == ffi.NULL:
        raise EngineBridgeError("C engine failed to execute polynomial linked list operation")
    try:
        raw_json = ffi.string(raw_pointer).decode("utf-8")
    finally:
        handle.library.structurax_free_string(raw_pointer)
    return parse_trace(raw_json)
