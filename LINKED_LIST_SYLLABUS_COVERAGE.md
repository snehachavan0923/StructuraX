# StructuraX Syllabus Coverage: Unit I — Introduction & Linked Lists

**Unit Code:** UNIT-01  
**Status:** 100% Implemented, C-Engine Verified & E2E Tested  
**Verification Date:** November 2026

---

## 1. Syllabus Overview & Architecture Mapping

Every topic in Unit I is powered by the real native C DSA Engine (`libstructurax_engine`), bridged through Python CFFI, exposed via FastAPI REST endpoints, and visualized through the interactive React animation workspace.

```
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│   SinglyLL | DoublyLL | CircularLL | Memory | Poly     │
└───────────────────────────▲────────────────────────────┘
                            │ JSON Execution Trace
┌───────────────────────────▼────────────────────────────┐
│                    FastAPI Backend                     │
│         /api/v1/execution/run [Pydantic V2]            │
└───────────────────────────▲────────────────────────────┘
                            │ Python CFFI Bridge
┌───────────────────────────▼────────────────────────────┐
│                  Native C DSA Engine                   │
│   singly_linked_list.c | doubly_linked_list.c         │
│   circular_linked_list.c | polynomial_linked_list.c    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Comprehensive Topic Coverage Matrix

| Topic # | Syllabus Topic Title | Theoretical Concepts Covered | Native C Engine Functions | CFFI Bridge & Parser | Frontend Interactive Workspace | E2E Test Suite |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Topic 1** | **Static Memory Allocation** | Stack frames, compile-time fixed buffers, activation records, stack pointer offset, stack overflow vulnerabilities. | Stack frame model in teaching suite | Model mapped | `MemoryAllocationWorkspace.tsx` (Concept & Stack view) | `unit1-linked-lists-complete.spec.ts` (Test 2) |
| **Topic 2** | **Dynamic Memory Allocation** | Heap segment, `malloc`, `calloc`, `realloc`, `free`, memory leaks, dangling pointers, double free, NULL pointer segmentation faults. | Memory allocator tracking in engine | Model mapped | `MemoryAllocationWorkspace.tsx` (Interactive Heap Sandbox, Leak simulator) | `unit1-linked-lists-complete.spec.ts` (Test 2) |
| **Topic 3** | **Singly Linked List** | Node composition (data + next), head pointer invariants, empty list handling, 13 operations. | `structurax_sll_execute` (`singly_linked_list.c`) | `call_sll_operation` (`engine.py`) | `SinglyLinkedListWorkspace.tsx` (All 8 learning stages) | `linked-list-module.spec.ts` |
| **Topic 4** | **Doubly Linked List** | Bidirectional pointers (`prev` and `next`), head/tail tracking, forward & backward traversals, 16 operations. | `structurax_dll_execute` (`doubly_linked_list.c`) | `call_dll_operation` (`engine.py`) | `DoublyLinkedListWorkspace.tsx` (Bidirectional node UI `<-->`) | `unit1-linked-lists-complete.spec.ts` (Test 3) |
| **Topic 5** | **Circular Linked List** | Cycle invariants, `tail->next == head`, termination conditions (`curr->next != head`), 12 operations. | `structurax_cll_execute` (`circular_linked_list.c`) | `call_cll_operation` (`engine.py`) | `CircularLinkedListWorkspace.tsx` (Loopback return curve connector) | `unit1-linked-lists-complete.spec.ts` (Test 4) |
| **Topic 6** | **Applications of Linked Lists** | Stack via LL (push/pop at head \(O(1)\)), Queue via LL (enqueue at tail, dequeue at head \(O(1)\)), Sparse Matrix representation. | Model & Stack/Queue mechanics | Model mapped | `PolynomialWorkspace.tsx` (Tab 3: Applications of Linked Lists) | `unit1-linked-lists-complete.spec.ts` (Test 5) |
| **Topic 7** | **Merging Linked Lists** | Iterative & sorted merging, two-pointer synchronization, non-destructive pointer reconnection. | `SLL_OP_MERGE`, `DLL_OP_MERGE`, `CLL_OP_MERGE` | Multi-list trace generator | Workspaces (Try It & Animation tabs) | CTest: `sll_tests`, `dll_tests`, `cll_tests` |
| **Topic 8** | **Reversing Linked Lists** | Iterative three-pointer (`prev`, `curr`, `next`), recursive reversal, stack unwinding. | `SLL_OP_REVERSE_ITERATIVE`, `SLL_OP_REVERSE_RECURSIVE`, `DLL_OP_REVERSE`, `CLL_OP_REVERSE` | Reversal event streams | Workspaces (Reverse Iterative & Recursive controls) | CTest: `sll_tests`, `dll_tests` |
| **Topic 9** | **Polynomial Representation & Arithmetic** | Polynomial terms \(c \cdot x^e\), descending exponent invariant, addition, subtraction, multiplication, like-term reduction. | `structurax_poly_execute` (`polynomial_linked_list.c`) | `call_poly_operation` (`engine.py`) | `PolynomialWorkspace.tsx` (Interactive algebra + Trace visualizer) | `unit1-linked-lists-complete.spec.ts` (Test 5) |

---

## 3. Detailed Operation Catalog

### Singly Linked List (13 Operations)
1. `CREATE` (empty list initialized with `head = NULL`)
2. `INSERT_FRONT` (\(O(1)\) insertion at beginning)
3. `INSERT_BACK` (\(O(n)\) traversal or \(O(1)\) with tail)
4. `INSERT_AT` (bounded positional insertion)
5. `DELETE_FRONT` (\(O(1)\) removal from beginning)
6. `DELETE_BACK` (\(O(n)\) removal from end)
7. `DELETE_AT` (positional node deletion and bypass link)
8. `SEARCH` (linear search with element comparison events)
9. `TRAVERSE` (full list traversal emitting `VISIT_NODE`)
10. `DISPLAY` (generates complete list snapshot)
11. `REVERSE_ITERATIVE` (three-pointer reversal: `prev`, `curr`, `next`)
12. `REVERSE_RECURSIVE` (recursive call stack reversal)
13. `MERGE` (sorted interleaving of two singly linked lists)

### Doubly Linked List (16 Operations)
1. `CREATE`
2. `INSERT_FRONT` (updates `head->prev` and `new_node->next`)
3. `INSERT_BACK` (updates `tail->next` and `new_node->prev`)
4. `INSERT_AT` (updates 4 pointers around target index)
5. `INSERT_BEFORE` (searches value and inserts node prior)
6. `INSERT_AFTER` (searches value and inserts node following)
7. `DELETE_FRONT` (frees head and sets `new_head->prev = NULL`)
8. `DELETE_BACK` (frees tail and sets `new_tail->next = NULL`)
9. `DELETE_AT` (unlinks node at arbitrary index)
10. `DELETE_VALUE` (searches node by value and unlinks)
11. `TRAVERSE_FORWARD` (traversal from `head` to `tail`)
12. `TRAVERSE_BACKWARD` (traversal from `tail` to `head`)
13. `SEARCH` (bidirectional search capability)
14. `DISPLAY` (generates node representation with dual links)
15. `REVERSE` (swaps `prev` and `next` pointers for all nodes)
16. `MERGE` (combines two doubly linked lists maintaining bidirectionality)

### Circular Linked List (12 Operations)
1. `CREATE`
2. `INSERT_FRONT` (inserts and updates `tail->next = new_head`)
3. `INSERT_BACK` (inserts and sets `new_node->next = head`)
4. `INSERT_AT` (inserts at position within the cycle)
5. `DELETE_FRONT` (deletes head and re-links tail to head->next)
6. `DELETE_BACK` (deletes tail and updates preceding node next to head)
7. `DELETE_AT` (deletes at circular position)
8. `SEARCH` (terminates on cycle return `curr->next == head`)
9. `TRAVERSE` (traverses circle without infinite loop)
10. `DISPLAY` (emits circular list representation with `is_circular: true`)
11. `REVERSE` (reverses all circular next pointers)
12. `MERGE` (interleaves two circular lists into one closed cycle)

### Polynomial Arithmetic (5 Operations)
1. `CREATE` (instantiates terms in canonical descending order)
2. `DISPLAY` (string format: \(c_1 x^{e_1} + c_2 x^{e_2} + \dots\))
3. `ADD` (combines like exponents, eliminates zero coefficients)
4. `SUBTRACT` (negates terms and combines like exponents)
5. `MULTIPLY` (Cartesian product of terms with term collection and reduction)
