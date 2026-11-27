#include "structurax_engine.h"
#include "polynomial_linked_list.h"
#include <assert.h>
#include <stdio.h>
#include <string.h>

static void test_poly_operations(void) {
    // Poly 1: 4x^3 + 3x^2 + 5 (exp: 3, 2, 0)
    int c1[] = {4, 3, 5};
    int e1[] = {3, 2, 0};

    // Poly 2: 2x^2 + 4x + 1 (exp: 2, 1, 0)
    int c2[] = {2, 4, 1};
    int e2[] = {2, 1, 0};

    // 1. Display
    char *trace = structurax_poly_execute(c1, e1, 3, NULL, NULL, 0, POLY_OP_DISPLAY);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"DISPLAY\"") != NULL);
    assert(strstr(trace, "4x^3 + 3x^2 + 5") != NULL);
    structurax_free_string(trace);

    // 2. Add
    trace = structurax_poly_execute(c1, e1, 3, c2, e2, 3, POLY_OP_ADD);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"ADD\"") != NULL);
    // 4x^3 + (3+2)x^2 + 4x + (5+1) = 4x^3 + 5x^2 + 4x + 6
    assert(strstr(trace, "4x^3 + 5x^2 + 4x + 6") != NULL);
    structurax_free_string(trace);

    // 3. Subtract
    trace = structurax_poly_execute(c1, e1, 3, c2, e2, 3, POLY_OP_SUBTRACT);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"SUBTRACT\"") != NULL);
    // 4x^3 + (3-2)x^2 - 4x + (5-1)
    assert(strstr(trace, "4x^3 + 1x^2") != NULL);
    structurax_free_string(trace);

    // 4. Multiply: (2x + 1) * (3x + 2) = 6x^2 + 7x + 2
    int mc1[] = {2, 1};
    int me1[] = {1, 0};
    int mc2[] = {3, 2};
    int me2[] = {1, 0};
    trace = structurax_poly_execute(mc1, me1, 2, mc2, me2, 2, POLY_OP_MULTIPLY);
    assert(trace != NULL);
    assert(strstr(trace, "\"operation\":\"MULTIPLY\"") != NULL);
    assert(strstr(trace, "6x^2 + 7x + 2") != NULL);
    structurax_free_string(trace);

    printf("All polynomial linked list C engine tests passed!\n");
}

int main(void) {
    test_poly_operations();
    return 0;
}
