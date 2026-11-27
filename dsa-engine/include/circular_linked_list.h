#ifndef STRUCTURAX_CIRCULAR_LINKED_LIST_H
#define STRUCTURAX_CIRCULAR_LINKED_LIST_H

#include "structurax_engine.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    CLL_OP_CREATE = 0,
    CLL_OP_INSERT_FRONT = 1,
    CLL_OP_INSERT_BACK = 2,
    CLL_OP_INSERT_AT = 3,
    CLL_OP_DELETE_FRONT = 4,
    CLL_OP_DELETE_BACK = 5,
    CLL_OP_DELETE_AT = 6,
    CLL_OP_SEARCH = 7,
    CLL_OP_TRAVERSE = 8,
    CLL_OP_DISPLAY = 9,
    CLL_OP_REVERSE = 10,
    CLL_OP_MERGE = 11
} cll_operation_type_t;

typedef struct cll_node {
    int id;
    int value;
    struct cll_node *next;
} cll_node_t;

typedef struct {
    cll_node_t *head;
    cll_node_t *tail;
    int size;
    int next_node_id;
} cll_list_t;

STRUCTURAX_API char *structurax_cll_execute(
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
