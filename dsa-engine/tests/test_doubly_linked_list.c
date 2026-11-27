#include "structurax_engine.h"
#include "doubly_linked_list.h"
#include <assert.h>
#include <stdio.h>
#include <string.h>

static void test_dll_operations(void) {
    int init_vals[] = {10, 20, 30};

    // 1. Insert Front
    char *trace = structurax_dll_execute(init_vals, 3, DLL_OP_INSERT_FRONT, 5, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_FRONT\"") != NULL);
    assert(strstr(trace, "[5,10,20,30]") != NULL);
    assert(strstr(trace, "\"valid\":true") != NULL);
    structurax_free_string(trace);

    // 2. Insert Back
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_INSERT_BACK, 40, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_BACK\"") != NULL);
    assert(strstr(trace, "[10,20,30,40]") != NULL);
    structurax_free_string(trace);

    // 3. Insert At
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_INSERT_AT, 15, 1, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_AT\"") != NULL);
    assert(strstr(trace, "[10,15,20,30]") != NULL);
    structurax_free_string(trace);

    // 4. Insert Before
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_INSERT_BEFORE, 19, 0, 20);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_BEFORE\"") != NULL);
    assert(strstr(trace, "[10,19,20,30]") != NULL);
    structurax_free_string(trace);

    // 5. Insert After
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_INSERT_AFTER, 25, 0, 20);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_AFTER\"") != NULL);
    assert(strstr(trace, "[10,20,25,30]") != NULL);
    structurax_free_string(trace);

    // 6. Delete Front
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_DELETE_FRONT, 0, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DELETE_FRONT\"") != NULL);
    assert(strstr(trace, "[20,30]") != NULL);
    structurax_free_string(trace);

    // 7. Delete Back
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_DELETE_BACK, 0, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DELETE_BACK\"") != NULL);
    assert(strstr(trace, "[10,20]") != NULL);
    structurax_free_string(trace);

    // 8. Delete At
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_DELETE_AT, 0, 1, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DELETE_AT\"") != NULL);
    assert(strstr(trace, "[10,30]") != NULL);
    structurax_free_string(trace);

    // 9. Delete by Value
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_DELETE_VALUE, 0, 0, 20);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DELETE_VALUE\"") != NULL);
    assert(strstr(trace, "[10,30]") != NULL);
    structurax_free_string(trace);

    // 10. Traverse Forward
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_TRAVERSE_FORWARD, 0, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"TRAVERSE_FORWARD\"") != NULL);
    structurax_free_string(trace);

    // 11. Traverse Backward
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_TRAVERSE_BACKWARD, 0, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"TRAVERSE_BACKWARD\"") != NULL);
    structurax_free_string(trace);

    // 12. Search
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_SEARCH, 20, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"found\":true") != NULL);
    structurax_free_string(trace);

    // 13. Reverse
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_REVERSE, 0, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"REVERSE\"") != NULL);
    assert(strstr(trace, "[30,20,10]") != NULL);
    structurax_free_string(trace);

    // 14. Merge
    trace = structurax_dll_execute(init_vals, 3, DLL_OP_MERGE, 99, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"MERGE\"") != NULL);
    assert(strstr(trace, "[10,20,30,99]") != NULL);
    structurax_free_string(trace);

    printf("All doubly linked list C engine tests passed!\n");
}

int main(void) {
    test_dll_operations();
    return 0;
}
