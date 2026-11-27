#ifndef STRUCTURAX_DOUBLY_LINKED_LIST_H
#define STRUCTURAX_DOUBLY_LINKED_LIST_H

#include "structurax_engine.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    DLL_OP_CREATE = 0,
    DLL_OP_INSERT_FRONT = 1,
    DLL_OP_INSERT_BACK = 2,
    DLL_OP_INSERT_AT = 3,
    DLL_OP_INSERT_BEFORE = 4,
    DLL_OP_INSERT_AFTER = 5,
    DLL_OP_DELETE_FRONT = 6,
    DLL_OP_DELETE_BACK = 7,
    DLL_OP_DELETE_AT = 8,
    DLL_OP_DELETE_VALUE = 9,
    DLL_OP_TRAVERSE_FORWARD = 10,
    DLL_OP_TRAVERSE_BACKWARD = 11,
    DLL_OP_SEARCH = 12,
    DLL_OP_DISPLAY = 13,
    DLL_OP_REVERSE = 14,
    DLL_OP_MERGE = 15
} dll_operation_type_t;

typedef struct dll_node {
    int id;
    int value;
    struct dll_node *prev;
    struct dll_node *next;
} dll_node_t;

typedef struct {
    dll_node_t *head;
    dll_node_t *tail;
    int size;
    int next_node_id;
} dll_list_t;

STRUCTURAX_API char *structurax_dll_execute(
    const int *initial_values,
    int initial_count,
    int operation_type,
    int value,
    int position,
    int target_value
);

#ifdef __cplusplus
}
#endif

#endif
