#include "doubly_linked_list.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_BUFFER_SIZE 65536
#define MAX_EVENTS 256

typedef struct {
    char events[MAX_EVENTS][512];
    int event_count;
    int visits;
    int allocations;
    int steps;
} dll_trace_collector_t;

static void trace_add_event(
    dll_trace_collector_t *tc,
    const char *event_type,
    const char *node_id,
    const char *payload_json,
    const char *pointers_json
) {
    if (tc->event_count >= MAX_EVENTS) return;
    tc->steps++;
    char node_field[64];
    if (node_id != NULL) {
        snprintf(node_field, sizeof(node_field), "\"%s\"", node_id);
    } else {
        snprintf(node_field, sizeof(node_field), "null");
    }

    snprintf(
        tc->events[tc->event_count],
        sizeof(tc->events[tc->event_count]),
        "{\"step\":%d,\"event_type\":\"%s\",\"node_id\":%s,\"payload\":%s,\"pointers\":%s,"
        "\"counters\":{\"visits\":%d,\"allocations\":%d}}",
        tc->steps,
        event_type,
        node_field,
        payload_json ? payload_json : "{}",
        pointers_json ? pointers_json : "{}",
        tc->visits,
        tc->allocations
    );
    tc->event_count++;
}

static dll_node_t *dll_create_node(int id, int value) {
    dll_node_t *node = (dll_node_t *)malloc(sizeof(dll_node_t));
    if (node == NULL) return NULL;
    node->id = id;
    node->value = value;
    node->prev = NULL;
    node->next = NULL;
    return node;
}

static void dll_free_list(dll_node_t *head) {
    dll_node_t *curr = head;
    while (curr != NULL) {
        dll_node_t *next = curr->next;
        free(curr);
        curr = next;
    }
}

static void format_dll_list_state(dll_node_t *head, dll_node_t *tail, int size, char *out, size_t out_size) {
    char nodes_buf[8192] = "[";
    dll_node_t *curr = head;
    int first = 1;
    while (curr != NULL) {
        char item[64];
        snprintf(item, sizeof(item), "%s%d", first ? "" : ",", curr->value);
        first = 0;
        strncat(nodes_buf, item, sizeof(nodes_buf) - strlen(nodes_buf) - 1);
        curr = curr->next;
    }
    strncat(nodes_buf, "]", sizeof(nodes_buf) - strlen(nodes_buf) - 1);

    char head_str[32] = "null";
    char tail_str[32] = "null";
    if (head != NULL) snprintf(head_str, sizeof(head_str), "\"node-%d\"", head->id);
    if (tail != NULL) snprintf(tail_str, sizeof(tail_str), "\"node-%d\"", tail->id);

    snprintf(
        out,
        out_size,
        "{\"size\":%d,\"nodes\":%s,\"head\":%s,\"tail\":%s}",
        size,
        nodes_buf,
        head_str,
        tail_str
    );
}

char *structurax_dll_execute(
    const int *initial_values,
    int initial_count,
    int operation_type,
    int value,
    int position,
    int target_value
) {
    dll_trace_collector_t tc;
    memset(&tc, 0, sizeof(tc));

    // 1. Build initial list
    dll_list_t list;
    list.head = NULL;
    list.tail = NULL;
    list.size = 0;
    list.next_node_id = 0;

    for (int i = 0; i < initial_count; i++) {
        dll_node_t *node = dll_create_node(list.next_node_id++, initial_values[i]);
        if (node == NULL) {
            dll_free_list(list.head);
            return NULL;
        }
        if (list.head == NULL) {
            list.head = node;
            list.tail = node;
        } else {
            list.tail->next = node;
            node->prev = list.tail;
            list.tail = node;
        }
        list.size++;
    }

    char initial_state[1024];
    format_dll_list_state(list.head, list.tail, list.size, initial_state, sizeof(initial_state));

    const char *op_name = "UNKNOWN";
    int is_valid = 1;
    char validation_msg[256] = "Operation completed successfully";

    switch ((dll_operation_type_t)operation_type) {
        case DLL_OP_CREATE: {
            op_name = "CREATE_LIST";
            dll_free_list(list.head);
            list.head = NULL;
            list.tail = NULL;
            list.size = 0;
            trace_add_event(&tc, "UPDATE_HEAD", NULL, "{\"action\":\"init_empty\"}", "{\"head\":null,\"tail\":null}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"empty_dll_created\"}", "{}");
            break;
        }

        case DLL_OP_INSERT_FRONT: {
            op_name = "INSERT_FRONT";
            dll_node_t *node = dll_create_node(list.next_node_id++, value);
            if (!node) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Memory allocation failed");
                break;
            }
            tc.allocations++;
            char nid[32];
            snprintf(nid, sizeof(nid), "node-%d", node->id);
            trace_add_event(&tc, "ALLOCATE_NODE", nid, "{\"action\":\"alloc_front\"}", "{}");

            if (list.head == NULL) {
                list.head = node;
                list.tail = node;
                list.size = 1;
                trace_add_event(&tc, "UPDATE_HEAD", nid, "{\"desc\":\"head = node\"}", "{\"head\":\"new_node\",\"tail\":\"new_node\"}");
            } else {
                node->next = list.head;
                trace_add_event(&tc, "SET_NEXT", nid, "{\"desc\":\"node->next = head\"}", "{}");
                list.head->prev = node;
                char old_head_id[32];
                snprintf(old_head_id, sizeof(old_head_id), "node-%d", list.head->id);
                trace_add_event(&tc, "SET_PREVIOUS", old_head_id, "{\"desc\":\"head->prev = node\"}", "{}");
                list.head = node;
                list.size++;
                trace_add_event(&tc, "UPDATE_HEAD", nid, "{\"desc\":\"head = node\"}", "{}");
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{\"status\":\"inserted_front\"}", "{}");
            break;
        }

        case DLL_OP_INSERT_BACK: {
            op_name = "INSERT_BACK";
            dll_node_t *node = dll_create_node(list.next_node_id++, value);
            if (!node) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Memory allocation failed");
                break;
            }
            tc.allocations++;
            char nid[32];
            snprintf(nid, sizeof(nid), "node-%d", node->id);
            trace_add_event(&tc, "ALLOCATE_NODE", nid, "{\"action\":\"alloc_back\"}", "{}");

            if (list.head == NULL) {
                list.head = node;
                list.tail = node;
                list.size = 1;
                trace_add_event(&tc, "UPDATE_HEAD", nid, "{\"desc\":\"head = node\"}", "{}");
            } else {
                list.tail->next = node;
                char old_tail_id[32];
                snprintf(old_tail_id, sizeof(old_tail_id), "node-%d", list.tail->id);
                trace_add_event(&tc, "SET_NEXT", old_tail_id, "{\"desc\":\"tail->next = node\"}", "{}");
                node->prev = list.tail;
                trace_add_event(&tc, "SET_PREVIOUS", nid, "{\"desc\":\"node->prev = tail\"}", "{}");
                list.tail = node;
                list.size++;
                trace_add_event(&tc, "UPDATE_TAIL", nid, "{\"desc\":\"tail = node\"}", "{}");
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{\"status\":\"inserted_back\"}", "{}");
            break;
        }

        case DLL_OP_INSERT_AT: {
            op_name = "INSERT_AT";
            if (position < 0 || position > list.size) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Position %d out of bounds for size %d", position, list.size);
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"out_of_bounds\"}", "{}");
                break;
            }
            if (position == 0) {
                // Same as insert front
                dll_node_t *node = dll_create_node(list.next_node_id++, value);
                tc.allocations++;
                char nid[32];
                snprintf(nid, sizeof(nid), "node-%d", node->id);
                trace_add_event(&tc, "ALLOCATE_NODE", nid, "{}", "{}");
                if (list.head == NULL) {
                    list.head = node;
                    list.tail = node;
                } else {
                    node->next = list.head;
                    list.head->prev = node;
                    list.head = node;
                }
                list.size++;
                trace_add_event(&tc, "UPDATE_HEAD", nid, "{}", "{}");
                trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{}", "{}");
            } else if (position == list.size) {
                // Same as insert back
                dll_node_t *node = dll_create_node(list.next_node_id++, value);
                tc.allocations++;
                char nid[32];
                snprintf(nid, sizeof(nid), "node-%d", node->id);
                trace_add_event(&tc, "ALLOCATE_NODE", nid, "{}", "{}");
                list.tail->next = node;
                node->prev = list.tail;
                list.tail = node;
                list.size++;
                trace_add_event(&tc, "UPDATE_TAIL", nid, "{}", "{}");
                trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{}", "{}");
            } else {
                dll_node_t *curr = list.head;
                for (int i = 0; i < position; i++) {
                    tc.visits++;
                    curr = curr->next;
                }
                dll_node_t *node = dll_create_node(list.next_node_id++, value);
                tc.allocations++;
                char nid[32];
                snprintf(nid, sizeof(nid), "node-%d", node->id);
                trace_add_event(&tc, "ALLOCATE_NODE", nid, "{}", "{}");
                node->prev = curr->prev;
                node->next = curr;
                if (curr->prev) curr->prev->next = node;
                curr->prev = node;
                list.size++;
                trace_add_event(&tc, "SET_NEXT", nid, "{\"desc\":\"node->next = curr\"}", "{}");
                trace_add_event(&tc, "SET_PREVIOUS", nid, "{\"desc\":\"node->prev = curr->prev\"}", "{}");
                trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{}", "{}");
            }
            break;
        }

        case DLL_OP_INSERT_BEFORE: {
            op_name = "INSERT_BEFORE";
            dll_node_t *curr = list.head;
            while (curr != NULL && curr->value != target_value) {
                tc.visits++;
                curr = curr->next;
            }
            if (curr == NULL) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Target value %d not found", target_value);
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"target_not_found\"}", "{}");
                break;
            }
            dll_node_t *node = dll_create_node(list.next_node_id++, value);
            tc.allocations++;
            char nid[32];
            snprintf(nid, sizeof(nid), "node-%d", node->id);
            trace_add_event(&tc, "ALLOCATE_NODE", nid, "{}", "{}");
            node->next = curr;
            node->prev = curr->prev;
            if (curr->prev != NULL) {
                curr->prev->next = node;
            } else {
                list.head = node;
                trace_add_event(&tc, "UPDATE_HEAD", nid, "{}", "{}");
            }
            curr->prev = node;
            list.size++;
            trace_add_event(&tc, "SET_NEXT", nid, "{}", "{}");
            trace_add_event(&tc, "SET_PREVIOUS", nid, "{}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{}", "{}");
            break;
        }

        case DLL_OP_INSERT_AFTER: {
            op_name = "INSERT_AFTER";
            dll_node_t *curr = list.head;
            while (curr != NULL && curr->value != target_value) {
                tc.visits++;
                curr = curr->next;
            }
            if (curr == NULL) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Target value %d not found", target_value);
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"target_not_found\"}", "{}");
                break;
            }
            dll_node_t *node = dll_create_node(list.next_node_id++, value);
            tc.allocations++;
            char nid[32];
            snprintf(nid, sizeof(nid), "node-%d", node->id);
            trace_add_event(&tc, "ALLOCATE_NODE", nid, "{}", "{}");
            node->prev = curr;
            node->next = curr->next;
            if (curr->next != NULL) {
                curr->next->prev = node;
            } else {
                list.tail = node;
                trace_add_event(&tc, "UPDATE_TAIL", nid, "{}", "{}");
            }
            curr->next = node;
            list.size++;
            trace_add_event(&tc, "SET_NEXT", nid, "{}", "{}");
            trace_add_event(&tc, "SET_PREVIOUS", nid, "{}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{}", "{}");
            break;
        }

        case DLL_OP_DELETE_FRONT: {
            op_name = "DELETE_FRONT";
            if (list.head == NULL) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "List is empty");
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"empty_list\"}", "{}");
                break;
            }
            dll_node_t *target = list.head;
            char tid[32];
            snprintf(tid, sizeof(tid), "node-%d", target->id);
            trace_add_event(&tc, "VISIT_NODE", tid, "{\"desc\":\"target_to_delete\"}", "{}");
            list.head = target->next;
            if (list.head != NULL) {
                list.head->prev = NULL;
                char hid[32];
                snprintf(hid, sizeof(hid), "node-%d", list.head->id);
                trace_add_event(&tc, "SET_PREVIOUS", hid, "{\"desc\":\"head->prev = NULL\"}", "{}");
                trace_add_event(&tc, "UPDATE_HEAD", hid, "{}", "{}");
            } else {
                list.tail = NULL;
                trace_add_event(&tc, "UPDATE_HEAD", NULL, "{\"desc\":\"list now empty\"}", "{}");
            }
            list.size--;
            trace_add_event(&tc, "RELEASE_NODE", tid, "{}", "{}");
            free(target);
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"deleted_front\"}", "{}");
            break;
        }

        case DLL_OP_DELETE_BACK: {
            op_name = "DELETE_BACK";
            if (list.tail == NULL) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "List is empty");
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"empty_list\"}", "{}");
                break;
            }
            dll_node_t *target = list.tail;
            char tid[32];
            snprintf(tid, sizeof(tid), "node-%d", target->id);
            trace_add_event(&tc, "VISIT_NODE", tid, "{\"desc\":\"target_to_delete\"}", "{}");
            list.tail = target->prev;
            if (list.tail != NULL) {
                list.tail->next = NULL;
                char tid_new[32];
                snprintf(tid_new, sizeof(tid_new), "node-%d", list.tail->id);
                trace_add_event(&tc, "SET_NEXT", tid_new, "{\"desc\":\"tail->next = NULL\"}", "{}");
                trace_add_event(&tc, "UPDATE_TAIL", tid_new, "{}", "{}");
            } else {
                list.head = NULL;
                trace_add_event(&tc, "UPDATE_TAIL", NULL, "{\"desc\":\"list now empty\"}", "{}");
            }
            list.size--;
            trace_add_event(&tc, "RELEASE_NODE", tid, "{}", "{}");
            free(target);
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"deleted_back\"}", "{}");
            break;
        }

        case DLL_OP_DELETE_AT: {
            op_name = "DELETE_AT";
            if (position < 0 || position >= list.size) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Position %d out of bounds for size %d", position, list.size);
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"out_of_bounds\"}", "{}");
                break;
            }
            dll_node_t *curr = list.head;
            for (int i = 0; i < position; i++) {
                tc.visits++;
                curr = curr->next;
            }
            char tid[32];
            snprintf(tid, sizeof(tid), "node-%d", curr->id);
            trace_add_event(&tc, "VISIT_NODE", tid, "{\"desc\":\"target_at_position\"}", "{}");
            if (curr->prev) curr->prev->next = curr->next;
            else list.head = curr->next;
            if (curr->next) curr->next->prev = curr->prev;
            else list.tail = curr->prev;
            list.size--;
            trace_add_event(&tc, "RELEASE_NODE", tid, "{}", "{}");
            free(curr);
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"deleted_at_pos\"}", "{}");
            break;
        }

        case DLL_OP_DELETE_VALUE: {
            op_name = "DELETE_VALUE";
            dll_node_t *curr = list.head;
            while (curr != NULL && curr->value != target_value) {
                tc.visits++;
                curr = curr->next;
            }
            if (curr == NULL) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Value %d not found in list", target_value);
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"not_found\"}", "{}");
                break;
            }
            char tid[32];
            snprintf(tid, sizeof(tid), "node-%d", curr->id);
            trace_add_event(&tc, "VISIT_NODE", tid, "{\"desc\":\"value_found_unlinking\"}", "{}");
            if (curr->prev) curr->prev->next = curr->next;
            else list.head = curr->next;
            if (curr->next) curr->next->prev = curr->prev;
            else list.tail = curr->prev;
            list.size--;
            trace_add_event(&tc, "RELEASE_NODE", tid, "{}", "{}");
            free(curr);
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"deleted_by_value\"}", "{}");
            break;
        }

        case DLL_OP_TRAVERSE_FORWARD: {
            op_name = "TRAVERSE_FORWARD";
            dll_node_t *curr = list.head;
            int idx = 0;
            while (curr != NULL) {
                tc.visits++;
                char cid[32];
                snprintf(cid, sizeof(cid), "node-%d", curr->id);
                char payload[128];
                snprintf(payload, sizeof(payload), "{\"index\":%d,\"value\":%d,\"direction\":\"forward\"}", idx++, curr->value);
                trace_add_event(&tc, "VISIT_NODE", cid, payload, "{\"dir\":\"forward\"}");
                curr = curr->next;
            }
            trace_add_event(&tc, "TRAVERSE_COMPLETE", NULL, "{\"direction\":\"forward\"}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"forward_traversal_done\"}", "{}");
            break;
        }

        case DLL_OP_TRAVERSE_BACKWARD: {
            op_name = "TRAVERSE_BACKWARD";
            dll_node_t *curr = list.tail;
            int idx = list.size - 1;
            while (curr != NULL) {
                tc.visits++;
                char cid[32];
                snprintf(cid, sizeof(cid), "node-%d", curr->id);
                char payload[128];
                snprintf(payload, sizeof(payload), "{\"index\":%d,\"value\":%d,\"direction\":\"backward\"}", idx--, curr->value);
                trace_add_event(&tc, "VISIT_NODE", cid, payload, "{\"dir\":\"backward\"}");
                curr = curr->prev;
            }
            trace_add_event(&tc, "TRAVERSE_COMPLETE", NULL, "{\"direction\":\"backward\"}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"backward_traversal_done\"}", "{}");
            break;
        }

        case DLL_OP_SEARCH: {
            op_name = "SEARCH";
            dll_node_t *curr = list.head;
            int idx = 0;
            int found = 0;
            while (curr != NULL) {
                tc.visits++;
                char cid[32];
                snprintf(cid, sizeof(cid), "node-%d", curr->id);
                char cmp[128];
                snprintf(cmp, sizeof(cmp), "{\"index\":%d,\"node_value\":%d,\"target\":%d}", idx, curr->value, value);
                trace_add_event(&tc, "COMPARE", cid, cmp, "{}");
                if (curr->value == value) {
                    found = 1;
                    trace_add_event(&tc, "OPERATION_COMPLETE", cid, "{\"found\":true}", "{}");
                    break;
                }
                curr = curr->next;
                idx++;
            }
            if (!found) {
                snprintf(validation_msg, sizeof(validation_msg), "Value %d not found in doubly linked list", value);
                trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"found\":false}", "{}");
            }
            break;
        }

        case DLL_OP_REVERSE: {
            op_name = "REVERSE";
            if (list.head == NULL || list.head->next == NULL) {
                trace_add_event(&tc, "OPERATION_COMPLETE", list.head ? "node-0" : NULL, "{\"status\":\"trivial_dll_reversed\"}", "{}");
                break;
            }
            dll_node_t *curr = list.head;
            dll_node_t *temp = NULL;
            while (curr != NULL) {
                tc.visits++;
                char cid[32];
                snprintf(cid, sizeof(cid), "node-%d", curr->id);
                temp = curr->prev;
                curr->prev = curr->next;
                curr->next = temp;
                trace_add_event(&tc, "UPDATE_POINTER", cid, "{\"desc\":\"swapped prev and next\"}", "{}");
                curr = curr->prev; // move forward using swapped prev
            }
            if (temp != NULL) {
                list.tail = list.head;
                list.head = temp->prev;
            }
            char new_head[32];
            snprintf(new_head, sizeof(new_head), "node-%d", list.head->id);
            trace_add_event(&tc, "UPDATE_HEAD", new_head, "{\"desc\":\"head updated to old tail\"}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", new_head, "{\"status\":\"reversed_doubly_linked_list\"}", "{}");
            break;
        }

        case DLL_OP_MERGE: {
            op_name = "MERGE";
            dll_node_t *sec_node = dll_create_node(list.next_node_id++, value > 0 ? value : 99);
            tc.allocations++;
            char sid[32];
            snprintf(sid, sizeof(sid), "node-%d", sec_node->id);
            trace_add_event(&tc, "ALLOCATE_NODE", sid, "{\"desc\":\"second_dll_node\"}", "{}");
            if (list.head == NULL) {
                list.head = sec_node;
                list.tail = sec_node;
                list.size = 1;
                trace_add_event(&tc, "UPDATE_HEAD", sid, "{}", "{}");
            } else {
                list.tail->next = sec_node;
                sec_node->prev = list.tail;
                char tid[32];
                snprintf(tid, sizeof(tid), "node-%d", list.tail->id);
                trace_add_event(&tc, "SET_NEXT", tid, "{\"desc\":\"tail->next = second_list\"}", "{}");
                trace_add_event(&tc, "SET_PREVIOUS", sid, "{\"desc\":\"second_list->prev = tail\"}", "{}");
                list.tail = sec_node;
                list.size++;
                trace_add_event(&tc, "UPDATE_TAIL", sid, "{}", "{}");
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", sid, "{\"status\":\"merged_doubly_linked_lists\"}", "{}");
            break;
        }

        case DLL_OP_DISPLAY:
        default: {
            op_name = "DISPLAY";
            trace_add_event(&tc, "VISIT_NODE", list.head ? "node-0" : NULL, "{\"desc\":\"displaying_dll_state\"}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"displayed\"}", "{}");
            break;
        }
    }

    char final_state[1024];
    format_dll_list_state(list.head, list.tail, list.size, final_state, sizeof(final_state));

    dll_free_list(list.head);

    char *result_buffer = (char *)malloc(MAX_BUFFER_SIZE);
    if (!result_buffer) return NULL;

    char events_joined[MAX_BUFFER_SIZE - 2048] = "[";
    for (int i = 0; i < tc.event_count; i++) {
        if (i > 0) strncat(events_joined, ",", sizeof(events_joined) - strlen(events_joined) - 1);
        strncat(events_joined, tc.events[i], sizeof(events_joined) - strlen(events_joined) - 1);
    }
    strncat(events_joined, "]", sizeof(events_joined) - strlen(events_joined) - 1);

    int written = snprintf(
        result_buffer,
        MAX_BUFFER_SIZE,
        "{\"schema_version\":\"1.0.0\","
        "\"operation_id\":\"dll-%s-%d\","
        "\"operation\":\"%s\","
        "\"initial_state\":%s,"
        "\"final_state\":%s,"
        "\"events\":%s,"
        "\"validation\":{\"valid\":%s,\"message\":\"%s\"},"
        "\"counters\":{\"visits\":%d,\"allocations\":%d,\"steps\":%d}}",
        op_name,
        tc.steps,
        op_name,
        initial_state,
        final_state,
        events_joined,
        is_valid ? "true" : "false",
        validation_msg,
        tc.visits,
        tc.allocations,
        tc.steps
    );

    if (written < 0 || written >= MAX_BUFFER_SIZE) {
        free(result_buffer);
        return NULL;
    }

    return result_buffer;
}
