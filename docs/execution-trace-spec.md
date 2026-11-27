# StructuraX Execution Trace Specification

**Version:** `1.1.0`  
**Status:** Approved & Enforced  
**Supported Topics:** `singly_linked_list`, `doubly_linked_list`, `circular_linked_list`, `polynomial`

---

## 1. Overview
The StructuraX Execution Trace is the core data exchange contract between the compiled C DSA Engine (`libstructurax_engine`) and the React visualizer (`TraceVisualizer`). Every execution event represents a discrete, deterministic transformation of heap memory, pointer reassignments, or traversal states.

---

## 2. Top-Level JSON Schema (`ExecutionTrace`)

```json
{
  "schema_version": "1.1.0",
  "operation_id": "dll-INSERT_AFTER-4",
  "operation": "INSERT_AFTER",
  "initial_state": {
    "size": 3,
    "nodes": [10, 20, 30],
    "head": "node-0",
    "tail": "node-2",
    "is_circular": false
  },
  "final_state": {
    "size": 4,
    "nodes": [10, 20, 25, 30],
    "head": "node-0",
    "tail": "node-3",
    "is_circular": false
  },
  "events": [
    {
      "step": 1,
      "event_type": "ALLOCATE_NODE",
      "node_id": "node-alloc",
      "payload": {
        "value": 25,
        "address": "0x40"
      },
      "pointers": {
        "head": "node-0",
        "tail": "node-2",
        "prev": null,
        "next": null
      },
      "counters": {
        "visits": 0,
        "allocations": 1
      }
    }
  ],
  "validation": {
    "valid": true,
    "message": "Operation completed successfully"
  },
  "counters": {
    "visits": 2,
    "allocations": 1,
    "steps": 6
  }
}
```

---

## 3. Polynomial State & Term Representation

For polynomial arithmetic (`polynomial`), `initial_state` and `final_state` contain polynomial terms ordered strictly in descending power:

```json
{
  "operation_id": "poly-ADD-7",
  "operation": "ADD",
  "final_state": {
    "size": 3,
    "nodes": [6, 7, 5],
    "terms": [
      { "coeff": 6, "exp": 3 },
      { "coeff": 7, "exp": 1 },
      { "coeff": 5, "exp": 0 }
    ],
    "expression": "6x^3 + 7x^1 + 5"
  }
}
```

---

## 4. Supported Event Types Across Data Structures

| Event Type | Target Structure | Description | Key Payload / Pointer Fields |
| :--- | :--- | :--- | :--- |
| `ALLOCATE_NODE` | SLL, DLL, CLL, Poly | Node allocated on heap. | `node_id`, `payload.value`, `payload.address` |
| `RELEASE_NODE` | SLL, DLL, CLL, Poly | Node memory deallocated with `free()`. | `node_id`, `payload.freed_value` |
| `SET_NEXT` | SLL, DLL, CLL, Poly | `node->next` pointer reassigned. | `node_id`, `pointers.next` |
| `SET_PREVIOUS` | DLL | `node->prev` backward pointer reassigned. | `node_id`, `pointers.prev` |
| `UPDATE_HEAD` | SLL, DLL, CLL | Head pointer shifted. | `node_id`, `pointers.head` |
| `UPDATE_TAIL` | DLL, CLL | Tail pointer shifted. | `node_id`, `pointers.tail` |
| `VISIT_NODE` | SLL, DLL, CLL, Poly | Traversal / search inspection of node. | `node_id`, `payload.value` or exponent |
| `COMPARE` | SLL, DLL, CLL | Value equality check during search. | `node_id`, `payload.target`, `payload.node_value` |
| `COMBINE_TERMS` | Polynomial | Adding or subtracting coefficients of equal exponents. | `payload.exp`, `payload.sum_coeff` |
| `TRAVERSE_COMPLETE` | All | Traversal sequence finished. | `payload.visited_count` |
| `OPERATION_COMPLETE`| All | Successful operation conclusion. | `payload.status: "OK"` |
| `OPERATION_ERROR` | All | Bounds violation, NULL dereference protection. | `payload.error`, `validation.valid: false` |

---

## 5. Pointer Invariants & Safe Address Mapping
- Symbolic addresses (`0x10`, `0x20`, `0x30`, ...) are deterministically assigned from node indices to provide a secure teaching abstraction.
- In Circular Linked Lists, the tail node contains `pointers: { "next": "node-0" }` and `final_state.is_circular: true`.
- In Doubly Linked Lists, every adjacent node pair maintains reflexive pointer symmetry: `curr->next->prev == curr`.
