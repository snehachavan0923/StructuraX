# StructuraX API Contract: Unit I Complete Modules

**API Prefix:** `/api/v1`  
**Current Version:** `1.1.0`  
**Covered Modules:** `singly_linked_list`, `doubly_linked_list`, `circular_linked_list`, `polynomial`

---

## 1. Execution Runner Endpoint

### `POST /api/v1/execution/run`
Executes operations directly on the compiled native C DSA Engine (`libstructurax_engine.dylib`) via the Python CFFI bridge and returns a deterministic execution trace.

#### Request Schema (`ExecutionRunRequest`)
```json
{
  "topic": "singly_linked_list",
  "operation": 1,
  "current_list": [10, 20, 30],
  "value": 5,
  "position": 0,
  "target_value": 0,
  "coeffs1": [4, 3, 5],
  "exps1": [3, 2, 0],
  "coeffs2": [2, -3, 7],
  "exps2": [3, 2, 1]
}
```

#### Operation Mappings by Topic

##### `topic: "singly_linked_list"`
- `0`: `CREATE` (empty list)
- `1`: `INSERT_FRONT`
- `2`: `INSERT_BACK`
- `3`: `INSERT_AT` (requires `position`)
- `4`: `DELETE_FRONT`
- `5`: `DELETE_BACK`
- `6`: `DELETE_AT` (requires `position`)
- `7`: `SEARCH` (requires `value`)
- `8`: `TRAVERSE`
- `9`: `DISPLAY`
- `10`: `REVERSE_ITERATIVE`
- `11`: `REVERSE_RECURSIVE`
- `12`: `MERGE`

##### `topic: "doubly_linked_list"`
- `0`: `CREATE`
- `1`: `INSERT_FRONT`
- `2`: `INSERT_BACK`
- `3`: `INSERT_AT` (requires `position`)
- `4`: `INSERT_BEFORE` (requires `target_value`, `value`)
- `5`: `INSERT_AFTER` (requires `target_value`, `value`)
- `6`: `DELETE_FRONT`
- `7`: `DELETE_BACK`
- `8`: `DELETE_AT` (requires `position`)
- `9`: `DELETE_VALUE` (requires `target_value`)
- `10`: `TRAVERSE_FORWARD`
- `11`: `TRAVERSE_BACKWARD`
- `12`: `SEARCH` (requires `value`)
- `13`: `DISPLAY`
- `14`: `REVERSE`
- `15`: `MERGE`

##### `topic: "circular_linked_list"`
- `0`: `CREATE`
- `1`: `INSERT_FRONT`
- `2`: `INSERT_BACK`
- `3`: `INSERT_AT` (requires `position`)
- `4`: `DELETE_FRONT`
- `5`: `DELETE_BACK`
- `6`: `DELETE_AT` (requires `position`)
- `7`: `SEARCH` (requires `value`)
- `8`: `TRAVERSE` (loops to head)
- `9`: `DISPLAY`
- `10`: `REVERSE`
- `11`: `MERGE`

##### `topic: "polynomial"`
- `0`: `CREATE`
- `1`: `DISPLAY`
- `2`: `ADD` (P1 + P2)
- `3`: `SUBTRACT` (P1 - P2)
- `4`: `MULTIPLY` (P1 * P2)

---

## 2. Interactive Prediction Validator

### `POST /api/v1/execution/predict/check`
Validates mid-algorithm active recall predictions without LLM hallucinations.

#### Request Body
```json
{
  "topic": "doubly_linked_list",
  "scenario_id": "pred_dll_insert_front",
  "selected_option_id": "opt_head_prev"
}
```

#### Response (`200 OK`)
```json
{
  "is_correct": true,
  "explanation": "Correct! When prepending to a doubly linked list, the old head's prev pointer must point back to the newly created node.",
  "expected_event_type": "SET_PREVIOUS"
}
```

---

## 3. Visual Debugging Challenge Validator

### `POST /api/v1/execution/debug/check`
Validates interactive debugging repairs for broken pointer scenarios.

#### Request Body
```json
{
  "topic": "circular_linked_list",
  "challenge_id": "debug_cll_broken_cycle",
  "action": "close_circle"
}
```

#### Response (`200 OK`)
```json
{
  "resolved": true,
  "message": "Circular topology restored! tail->next now points back to head.",
  "fixed_state": [10, 20, 30]
}
```

---

## 4. Concept Quiz Submission

### `POST /api/v1/execution/quiz/submit`
Validates conceptual comprehension across time complexity, pointer invariants, and memory models.

#### Request Body
```json
{
  "topic": "circular_linked_list",
  "answers": {
    "q1": "head",
    "q2": "infinite",
    "q3": "round_robin",
    "q4": "o1"
  }
}
```

#### Response (`200 OK`)
```json
{
  "score": 4,
  "total": 4,
  "passed": true,
  "explanations": {
    "q1": "In a circular list, the last node links back to the head.",
    "q2": "Failing to check curr->next != head causes infinite loops."
  }
}
```
