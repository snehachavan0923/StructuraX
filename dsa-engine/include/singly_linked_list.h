#ifndef STRUCTURAX_SINGLY_LINKED_LIST_H
#define STRUCTURAX_SINGLY_LINKED_LIST_H

#include "structurax_engine.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    SLL_OP_CREATE = 0,
    SLL_OP_INSERT_FRONT = 1,
    SLL_OP_INSERT_BACK = 2,
    SLL_OP_INSERT_AT = 3,
    SLL_OP_DELETE_FRONT = 4,
    SLL_OP_DELETE_BACK = 5,
    SLL_OP_DELETE_AT = 6,
    SLL_OP_SEARCH = 7,
    SLL_OP_TRAVERSE = 8,
    SLL_OP_DISPLAY = 9,
    SLL_OP_REVERSE_ITERATIVE = 10,
    SLL_OP_REVERSE_RECURSIVE = 11,
    SLL_OP_MERGE = 12
} sll_operation_type_t;

typedef struct sll_node {
    int id;
    int value;
    struct sll_node *next;
} sll_node_t;

typedef struct {
    sll_node_t *head;
    int size;
    int next_node_id;
} sll_list_t;

STRUCTURAX_API char *structurax_sll_execute(
    const int *initial_values,
    int initial_count,
    int operation_type,
    int value,
    int position
);

#ifdef __cplusplus
}
#endif

#endif
