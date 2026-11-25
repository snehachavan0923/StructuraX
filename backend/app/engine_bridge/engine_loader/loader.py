import os
import platform
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.core.config import settings
from app.core.exceptions import EngineBridgeError
from app.engine_bridge.cffi_bridge.engine import get_ffi

PROJECT_ROOT = Path(__file__).resolve().parents[4]
BUILD_DIR = PROJECT_ROOT / "dsa-engine" / "build"


@dataclass(frozen=True)
class EngineHandle:
    library: Any
    path: Path


def expected_library_name() -> str:
    system = platform.system()
    if system == "Darwin":
        return "libstructurax_engine.dylib"
    if system == "Linux":
        return "libstructurax_engine.so"
    if system == "Windows":
        return "structurax_engine.dll"
    raise EngineBridgeError(f"Unsupported platform for C engine: {system}")


def resolve_library_path() -> Path | None:
    configured = settings.dsa_engine_library_path or os.getenv("DSA_ENGINE_LIBRARY_PATH")
    candidates: list[Path] = []
    if configured:
        candidates.append(Path(configured).expanduser())
    candidates.append(BUILD_DIR / expected_library_name())
    for candidate in candidates:
        if candidate.is_file():
            return candidate.resolve()
    return None


@lru_cache(maxsize=1)
def load_engine() -> EngineHandle:
    path = resolve_library_path()
    if path is None:
        raise EngineBridgeError(
            "C engine library not found; build it with cmake --build dsa-engine/build"
        )
    ffi = get_ffi()
    try:
        library = ffi.dlopen(str(path))
    except OSError as exc:
        raise EngineBridgeError(f"Failed to load C engine library: {exc}") from exc
    if library.structurax_engine_init() != 0:
        raise EngineBridgeError("C engine initialization failed")
    return EngineHandle(library=library, path=path)
