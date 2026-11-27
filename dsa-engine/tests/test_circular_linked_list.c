#include "structurax_engine.h"
#include "circular_linked_list.h"
#include <assert.h>
#include <stdio.h>
#include <string.h>

static void test_cll_operations(void) {
    int init_vals[] = {10, 20, 30};

    // 1. Insert Front
    char *trace = structurax_cll_execute(init_vals, 3, CLL_OP_INSERT_FRONT, 5, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_FRONT\"") != NULL);
    assert(strstr(trace, "[5,10,20,30]") != NULL);
    assert(strstr(trace, "\"is_circular\":true") != NULL);
    structurax_free_string(trace);

    // 2. Insert Back
    trace = structurax_cll_execute(init_vals, 3, CLL_OP_INSERT_BACK, 40, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_BACK\"") != NULL);
    assert(strstr(trace, "[10,20,30,40]") != NULL);
    structurax_free_string(trace);

    // 3. Insert At
    trace = structurax_cll_execute(init_vals, 3, CLL_OP_INSERT_AT, 15, 1);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"INSERT_AT\"") != NULL);
    assert(strstr(trace, "[10,15,20,30]") != NULL);
    structurax_free_string(trace);

    // 4. Delete Front
    trace = structurax_cll_execute(init_vals, 3, CLL_OP_DELETE_FRONT, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DELETE_FRONT\"") != NULL);
    assert(strstr(trace, "[20,30]") != NULL);
    structurax_free_string(trace);

    // 5. Delete Back
    trace = structurax_cll_execute(init_vals, 3, CLL_OP_DELETE_BACK, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DELETE_BACK\"") != NULL);
    assert(strstr(trace, "[10,20]") != NULL);
    structurax_free_string(trace);

    // 6. Delete At
    trace = structurax_cll_execute(init_vals, 3, CLL_OP_DELETE_AT, 0, 1);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DELETE_AT\"") != NULL);
    assert(strstr(trace, "[10,30]") != NULL);
    structurax_free_string(trace);

    // 7. Search
    trace = structurax_cll_execute(init_vals, 3, CLL_OP_SEARCH, 20, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"found\":true") != NULL);
    structurax_free_string(trace);

    // 8. Traverse (terminates correctly without infinite loop)
    trace = structurax_cll_execute(init_vals, 3, CLL_OP_TRAVERSE, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"TRAVERSE\"") != NULL);
    assert(strstr(trace, "\"circle_closed\":true") != NULL);
    structurax_free_string(trace);

    // 9. Reverse
    trace = structurax_cll_execute(init_vals, 3, CLL_OP_REVERSE, 0, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"REVERSE\"") != NULL);
    assert(strstr(trace, "[30,20,10]") != NULL);
    structurax_free_string(trace);

    // 10. Merge
    trace = structurax_cll_execute(init_vals, 3, CLL_OP_MERGE, 99, 0);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"MERGE\"") != NULL);
    assert(strstr(trace, "[10,20,30,99]") != NULL);
    structurax_free_string(trace);

    printf("All circular linked list C engine tests passed!\n");
}

int main(void) {
    test_cll_operations();
    return 0;
}
