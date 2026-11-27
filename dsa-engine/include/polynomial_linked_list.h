#ifndef STRUCTURAX_POLYNOMIAL_LINKED_LIST_H
#define STRUCTURAX_POLYNOMIAL_LINKED_LIST_H

#include "structurax_engine.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    POLY_OP_CREATE = 0,
    POLY_OP_DISPLAY = 1,
    POLY_OP_ADD = 2,
    POLY_OP_SUBTRACT = 3,
    POLY_OP_MULTIPLY = 4
} poly_operation_type_t;

typedef struct poly_node {
    int id;
    int coeff;
    int exp;
    struct poly_node *next;
} poly_node_t;

typedef struct {
    poly_node_t *head;
    int size;
    int next_node_id;
} poly_list_t;

STRUCTURAX_API char *structurax_poly_execute(
    const int *coeffs1,
    const int *exps1,
    int count1,
    const int *coeffs2,
    const int *exps2,
    int count2,
    int operation_type
);

#ifdef __cplusplus
}
#endif

#endif
