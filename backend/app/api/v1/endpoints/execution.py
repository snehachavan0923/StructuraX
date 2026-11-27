from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from app.schemas.execution import (
    DebuggingCheckRequest,
    DebuggingCheckResponse,
    ExecutionRunRequest,
    PredictionCheckRequest,
    PredictionCheckResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
)
from app.schemas.trace import ExecutionTrace
from app.services.engine_service import EngineService

router = APIRouter(prefix="/execution", tags=["execution"])

engine_service = EngineService()


def get_engine_service() -> EngineService:
    return engine_service


@router.post("/run", response_model=ExecutionTrace)
def run_execution(
    request: ExecutionRunRequest,
    service: Annotated[EngineService, Depends(get_engine_service)],
) -> ExecutionTrace:
    topic = request.topic.lower().replace("-", "_")
    try:
        if topic in ("doubly_linked_list", "doubly"):
            return service.run_dll_operation(
                initial_values=request.current_list,
                operation_type=request.operation,
                value=request.value,
                position=request.position,
                target_value=request.target_value,
            )
        if topic in ("circular_linked_list", "circular_lists", "circular"):
            return service.run_cll_operation(
                initial_values=request.current_list,
                operation_type=request.operation,
                value=request.value,
                position=request.position,
            )
        if topic in ("polynomial", "polynomial_arithmetic", "polynomial_linked_list"):
            return service.run_poly_operation(
                coeffs1=request.coeffs1,
                exps1=request.exps1,
                coeffs2=request.coeffs2,
                exps2=request.exps2,
                operation_type=request.operation,
            )
        # Default: Singly Linked List
        return service.run_sll_operation(
            initial_values=request.current_list,
            operation_type=request.operation,
            value=request.value,
            position=request.position,
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/predict/check", response_model=PredictionCheckResponse)
def check_prediction(request: PredictionCheckRequest) -> PredictionCheckResponse:
    scenarios = {
        "pred_insert_front": {
            "correct_option": "opt_set_next",
            "explanation": (
                "Before changing the head pointer, new_node->next must point to the "
                "current head to avoid losing the rest of the list."
            ),
            "expected_event": "SET_NEXT",
        },
        "pred_delete_front": {
            "correct_option": "opt_head_next",
            "explanation": (
                "head = head->next immediately updates the list entry point before "
                "freeing the old head node."
            ),
            "expected_event": "UPDATE_HEAD",
        },
        "pred_cycle_detect": {
            "correct_option": "opt_slow_fast",
            "explanation": (
                "In Floyd's algorithm, fast advances by 2 steps while slow advances by 1 step."
            ),
            "expected_event": "VISIT_NODE",
        },
        "pred_dll_insert_front": {
            "correct_option": "opt_head_prev",
            "explanation": (
                "In a Doubly Linked List, head->prev must be linked to new_node "
                "to maintain the bidirectional backward reference."
            ),
            "expected_event": "SET_PREVIOUS",
        },
        "pred_cll_insert_front": {
            "correct_option": "opt_tail_next",
            "explanation": (
                "In a Circular Linked List, tail->next must be redirected to new_node "
                "so the circle remains closed."
            ),
            "expected_event": "SET_NEXT",
        },
    }

    scenario = scenarios.get(request.scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Prediction scenario not found")

    is_correct = request.selected_option_id == scenario["correct_option"]
    return PredictionCheckResponse(
        is_correct=is_correct,
        explanation=scenario["explanation"],
        expected_event_type=scenario["expected_event"],
    )


@router.post("/debug/check", response_model=DebuggingCheckResponse)
def check_debugging(request: DebuggingCheckRequest) -> DebuggingCheckResponse:
    if request.challenge_id == "debug_cycle_broken":
        if request.action == "disconnect_cycle":
            return DebuggingCheckResponse(
                resolved=True,
                message="Cycle severed! The tail node now correctly terminates with NULL.",
                fixed_state=[10, 20, 30],
            )
        return DebuggingCheckResponse(
            resolved=False,
            message="Node pointer reassignment did not resolve the infinite loop cycle.",
            fixed_state=[10, 20, 30],
        )

    if request.challenge_id == "debug_lost_head":
        if request.action == "relink_head":
            return DebuggingCheckResponse(
                resolved=True,
                message="Head pointer re-anchored to the true first element (0x10)!",
                fixed_state=[14, 28, 42],
            )
        return DebuggingCheckResponse(
            resolved=False,
            message="Head pointer still points to a detached node.",
            fixed_state=[14, 28, 42],
        )

    if request.challenge_id == "debug_dll_broken_prev":
        if request.action == "relink_prev":
            return DebuggingCheckResponse(
                resolved=True,
                message="Backward pointer restored! Both prev and next are synchronized.",
                fixed_state=[10, 20, 30],
            )
        return DebuggingCheckResponse(
            resolved=False,
            message="Dangling prev pointer still references invalid memory.",
            fixed_state=[10, 20, 30],
        )

    if request.challenge_id == "debug_cll_broken_cycle":
        if request.action == "close_circle":
            return DebuggingCheckResponse(
                resolved=True,
                message="Circular topology restored! tail->next now points back to head.",
                fixed_state=[10, 20, 30],
            )
        return DebuggingCheckResponse(
            resolved=False,
            message="Tail node still points to NULL instead of wrapping back to head.",
            fixed_state=[10, 20, 30],
        )

    raise HTTPException(status_code=404, detail="Debugging challenge not found")


@router.post("/quiz/submit", response_model=QuizSubmitResponse)
def submit_quiz(request: QuizSubmitRequest) -> QuizSubmitResponse:
    topic = request.topic.lower().replace("-", "_")

    if topic in ("doubly_linked_list", "doubly"):
        correct_answers = {
            "q1": "q1_opt_b",  # Node has data + prev + next
            "q2": "q2_opt_b",  # Deleting node with direct reference is O(1)
            "q3": "q3_opt_a",  # Backward traversal begins at tail
            "q4": "q4_opt_c",  # Reversing swaps prev and next for each node
        }
        explanations = {
            "q1": "Each DLL node contains a value, a prev pointer, and a next pointer.",
            "q2": "Because DLL nodes know their predecessor via prev, unlinking is O(1).",
            "q3": "Backward traversal starts at tail and follows prev pointers.",
            "q4": "Reversing a DLL requires swapping prev/next and swapping head/tail.",
        }
    elif topic in ("circular_linked_list", "circular_lists", "circular"):
        correct_answers = {
            "q1": "q1_opt_a",  # Tail next points to head
            "q2": "q2_opt_c",  # Traversal terminates when curr returns to head
            "q3": "q3_opt_b",  # Useful for round-robin scheduling
            "q4": "q4_opt_a",  # Single node points to itself
        }
        explanations = {
            "q1": "In a circular linked list, the last node points back to the head node.",
            "q2": "Traversal must stop when the pointer reaches head to avoid infinite loops.",
            "q3": "Circular lists naturally model round-robin schedulers and resource cycling.",
            "q4": "A single-node circular list has its next pointer pointing back to itself.",
        }
    else:
        correct_answers = {
            "q1": "q1_opt_b",  # Node contains data + next pointer
            "q2": "q2_opt_a",  # Insertion at head is O(1)
            "q3": "q3_opt_c",  # Deleting without prev reference requires O(n) traversal
            "q4": "q4_opt_b",  # Last node's next pointer points to NULL
        }
        explanations = {
            "q1": "A singly linked list node contains data and a pointer to the next node.",
            "q2": "Prepending to the front requires allocating node and updating head (O(1)).",
            "q3": "Finding predecessor before target requires a linear scan from head.",
            "q4": "A non-circular singly linked list is terminated by pointing next to NULL.",
        }

    score = 0
    results = {}
    for q_id, expected_ans in correct_answers.items():
        user_ans = request.answers.get(q_id)
        is_match = user_ans == expected_ans
        results[q_id] = is_match
        if is_match:
            score += 1

    total = len(correct_answers)
    return QuizSubmitResponse(
        score=score,
        total=total,
        passed=(score >= 3),
        results=results,
        explanations=explanations,
    )
