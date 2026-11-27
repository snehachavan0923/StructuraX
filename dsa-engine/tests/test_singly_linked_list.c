#include "structurax_engine.h"
#include "singly_linked_list.h"
#include <assert.h>
#include <stdio.h>
#include <string.h>

static void test_sll_operations(void) {
    int init_vals[] = {10, 20, 30};

    // 1. Insert Front
    char *trace = structurax_sll_execute(init_vals, 3, SLL_OP_INSERT_FRONT, 5, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_FRONT\"") != NULL);
    assert(strstr(trace, "\"event_type\":\"ALLOCATE_NODE\"") != NULL);
    assert(strstr(trace, "\"event_type\":\"SET_NEXT\"") != NULL);
    assert(strstr(trace, "\"event_type\":\"UPDATE_HEAD\"") != NULL);
    assert(strstr(trace, "\"size\":4") != NULL);
    assert(strstr(trace, "\"valid\":true") != NULL);
    structurax_free_string(trace);

    // 2. Insert Back
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_INSERT_BACK, 40, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_BACK\"") != NULL);
    assert(strstr(trace, "[10,20,30,40]") != NULL);
    structurax_free_string(trace);

    // 3. Insert At (middle)
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_INSERT_AT, 15, 1);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_AT\"") != NULL);
    assert(strstr(trace, "[10,15,20,30]") != NULL);
    structurax_free_string(trace);

    // 4. Insert At (invalid position)
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_INSERT_AT, 99, 10);
    assert(trace != NULL);
    assert(strstr(trace, "\"valid\":false") != NULL);
    assert(strstr(trace, "Invalid position") != NULL);
    structurax_free_string(trace);

    // 5. Delete Front
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_DELETE_FRONT, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DELETE_FRONT\"") != NULL);
    assert(strstr(trace, "\"event_type\":\"RELEASE_NODE\"") != NULL);
    assert(strstr(trace, "[20,30]") != NULL);
    structurax_free_string(trace);

    // 6. Delete Back
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_DELETE_BACK, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DELETE_BACK\"") != NULL);
    assert(strstr(trace, "[10,20]") != NULL);
    structurax_free_string(trace);

    // 7. Delete At
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_DELETE_AT, 0, 1);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DELETE_AT\"") != NULL);
    assert(strstr(trace, "[10,30]") != NULL);
    structurax_free_string(trace);

    // 8. Delete from empty list
    trace = structurax_sll_execute(NULL, 0, SLL_OP_DELETE_FRONT, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"valid\":false") != NULL);
    assert(strstr(trace, "empty list") != NULL);
    structurax_free_string(trace);

    // 9. Search (found)
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_SEARCH, 20, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"SEARCH\"") != NULL);
    assert(strstr(trace, "\"found\":true") != NULL);
    assert(strstr(trace, "\"event_type\":\"COMPARE\"") != NULL);
    structurax_free_string(trace);

    // 10. Search (not found)
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_SEARCH, 999, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"found\":false") != NULL);
    structurax_free_string(trace);

    // 11. Traverse
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_TRAVERSE, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"TRAVERSE\"") != NULL);
    assert(strstr(trace, "\"event_type\":\"TRAVERSE_COMPLETE\"") != NULL);
    structurax_free_string(trace);

    // 12. Reverse Iterative
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_REVERSE_ITERATIVE, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"REVERSE_ITERATIVE\"") != NULL);
    assert(strstr(trace, "[30,20,10]") != NULL);
    assert(strstr(trace, "\"valid\":true") != NULL);
    structurax_free_string(trace);

    // 13. Reverse Recursive
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_REVERSE_RECURSIVE, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"REVERSE_RECURSIVE\"") != NULL);
    assert(strstr(trace, "[30,20,10]") != NULL);
    assert(strstr(trace, "\"valid\":true") != NULL);
    structurax_free_string(trace);

    // 14. Merge
    trace = structurax_sll_execute(init_vals, 3, SLL_OP_MERGE, 99, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"MERGE\"") != NULL);
    assert(strstr(trace, "[10,20,30,99]") != NULL);
    structurax_free_string(trace);

    printf("All singly linked list C engine tests passed!\n");
}

int main(void) {
    test_sll_operations();
    return 0;
}
