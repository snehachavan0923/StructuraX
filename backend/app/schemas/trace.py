from typing import Any, Literal

from pydantic import BaseModel, Field, model_validator


class TraceEvent(BaseModel):
    step: int = Field(gt=0)
    event_type: str = Field(min_length=1)
    node_id: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    pointers: dict[str, Any] = Field(default_factory=dict)
    counters: dict[str, int] = Field(default_factory=dict)


class TraceValidation(BaseModel):
    valid: bool
    message: str = ""


class ExecutionTrace(BaseModel):
    schema_version: Literal["1.0.0"]
    operation_id: str = Field(min_length=1)
    operation: str = Field(min_length=1)
    initial_state: dict[str, Any]
    final_state: dict[str, Any]
    events: list[TraceEvent]
    validation: TraceValidation
    counters: dict[str, int] = Field(default_factory=dict)

    @model_validator(mode="after")
    def check_event_order(self) -> "ExecutionTrace":
        steps = [event.step for event in self.events]
        if steps != sorted(steps) or len(steps) != len(set(steps)):
            raise ValueError("event steps must be unique and strictly increasing")
        return self
