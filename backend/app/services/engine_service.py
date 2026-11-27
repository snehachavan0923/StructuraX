from app.engine_bridge.cffi_bridge.engine import get_ffi
from app.schemas.health import ComponentReport, ComponentStatus
from app.schemas.trace import ExecutionTrace


class EngineService:
    def describe(self) -> ComponentReport:
        try:
            from app.engine_bridge.engine_loader.loader import load_engine

            handle = load_engine()
            version = get_ffi().string(handle.library.structurax_engine_version()).decode("utf-8")
            initialized = handle.library.structurax_engine_is_initialized()
        except Exception as exc:
            return ComponentReport(
                status=ComponentStatus.DEGRADED,
                detail=f"engine unavailable: {type(exc).__name__}",
            )
        if not initialized:
            return ComponentReport(status=ComponentStatus.DEGRADED, detail="engine not initialized")
        return ComponentReport(
            status=ComponentStatus.HEALTHY,
            detail=f"C engine loaded from {handle.path.name}",
            version=version,
        )

    def run_test_operation(self, left: int, right: int) -> ExecutionTrace:
        from app.engine_bridge.engine_loader.loader import load_engine
        from app.engine_bridge.trace_parser.parser import call_test_operation

        return call_test_operation(load_engine(), left, right)

    def run_sll_operation(
        self,
        initial_values: list[int],
        operation_type: int,
        value: int = 0,
        position: int = 0,
    ) -> ExecutionTrace:
        from app.engine_bridge.engine_loader.loader import load_engine
        from app.engine_bridge.trace_parser.parser import call_sll_operation

        return call_sll_operation(
            load_engine(),
            initial_values,
            operation_type,
            value,
            position,
        )

    def run_dll_operation(
        self,
        initial_values: list[int],
        operation_type: int,
        value: int = 0,
        position: int = 0,
        target_value: int = 0,
    ) -> ExecutionTrace:
        from app.engine_bridge.engine_loader.loader import load_engine
        from app.engine_bridge.trace_parser.parser import call_dll_operation

        return call_dll_operation(
            load_engine(),
            initial_values,
            operation_type,
            value,
            position,
            target_value,
        )

    def run_cll_operation(
        self,
        initial_values: list[int],
        operation_type: int,
        value: int = 0,
        position: int = 0,
    ) -> ExecutionTrace:
        from app.engine_bridge.engine_loader.loader import load_engine
        from app.engine_bridge.trace_parser.parser import call_cll_operation

        return call_cll_operation(
            load_engine(),
            initial_values,
            operation_type,
            value,
            position,
        )

    def run_poly_operation(
        self,
        coeffs1: list[int],
        exps1: list[int],
        coeffs2: list[int],
        exps2: list[int],
        operation_type: int,
    ) -> ExecutionTrace:
        from app.engine_bridge.engine_loader.loader import load_engine
        from app.engine_bridge.trace_parser.parser import call_poly_operation

        return call_poly_operation(
            load_engine(),
            coeffs1,
            exps1,
            coeffs2,
            exps2,
            operation_type,
        )
