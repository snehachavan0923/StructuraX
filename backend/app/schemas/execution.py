from enum import IntEnum

from pydantic import BaseModel, Field


class SllOperationType(IntEnum):
    CREATE = 0
    INSERT_FRONT = 1
    INSERT_BACK = 2
    INSERT_AT = 3
    DELETE_FRONT = 4
    DELETE_BACK = 5
    DELETE_AT = 6
    SEARCH = 7
    TRAVERSE = 8
    DISPLAY = 9
    REVERSE_ITERATIVE = 10
    REVERSE_RECURSIVE = 11
    MERGE = 12


class DllOperationType(IntEnum):
    CREATE = 0
    INSERT_FRONT = 1
    INSERT_BACK = 2
    INSERT_AT = 3
    INSERT_BEFORE = 4
    INSERT_AFTER = 5
    DELETE_FRONT = 6
    DELETE_BACK = 7
    DELETE_AT = 8
    DELETE_VALUE = 9
    TRAVERSE_FORWARD = 10
    TRAVERSE_BACKWARD = 11
    SEARCH = 12
    DISPLAY = 13
    REVERSE = 14
    MERGE = 15


class CllOperationType(IntEnum):
    CREATE = 0
    INSERT_FRONT = 1
    INSERT_BACK = 2
    INSERT_AT = 3
    DELETE_FRONT = 4
    DELETE_BACK = 5
    DELETE_AT = 6
    SEARCH = 7
    TRAVERSE = 8
    DISPLAY = 9
    REVERSE = 10
    MERGE = 11


class PolyOperationType(IntEnum):
    CREATE = 0
    DISPLAY = 1
    ADD = 2
    SUBTRACT = 3
    MULTIPLY = 4


class ExecutionRunRequest(BaseModel):
    topic: str = "singly_linked_list"
    operation: int = 1
    current_list: list[int] = Field(default_factory=list)
    value: int = 0
    position: int = 0
    target_value: int = 0
    coeffs1: list[int] = Field(default_factory=list)
    exps1: list[int] = Field(default_factory=list)
    coeffs2: list[int] = Field(default_factory=list)
    exps2: list[int] = Field(default_factory=list)


class PredictionCheckRequest(BaseModel):
    topic: str = "singly_linked_list"
    scenario_id: str
    selected_option_id: str


class PredictionCheckResponse(BaseModel):
    is_correct: bool
    explanation: str
    expected_event_type: str


class DebuggingCheckRequest(BaseModel):
    topic: str = "singly_linked_list"
    challenge_id: str
    action: str
    target_node_id: str | None = None
    target_value: int | None = None


class DebuggingCheckResponse(BaseModel):
    resolved: bool
    message: str
    fixed_state: list[int]


class QuizSubmitRequest(BaseModel):
    topic: str = "singly_linked_list"
    answers: dict[str, str]  # question_id -> selected_option_id


class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    passed: bool
    results: dict[str, bool]
    explanations: dict[str, str]
