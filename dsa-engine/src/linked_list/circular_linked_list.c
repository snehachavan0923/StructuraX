#include "circular_linked_list.h"
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
} cll_trace_collector_t;

static void trace_add_event(
    cll_trace_collector_t *tc,
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

static cll_node_t *cll_create_node(int id, int value) {
    cll_node_t *node = (cll_node_t *)malloc(sizeof(cll_node_t));
    if (node == NULL) return NULL;
    node->id = id;
    node->value = value;
    node->next = NULL;
    return node;
}

static void cll_free_list(cll_node_t *head, cll_node_t *tail) {
    if (head == NULL) return;
    if (tail != NULL) tail->next = NULL; // break cycle before freeing
    cll_node_t *curr = head;
    while (curr != NULL) {
        cll_node_t *next = curr->next;
        free(curr);
        curr = next;
    }
}

static void format_cll_list_state(cll_node_t *head, cll_node_t *tail, int size, char *out, size_t out_size) {
    char nodes_buf[8192] = "[";
    if (head != NULL) {
        cll_node_t *curr = head;
        int first = 1;
        for (int i = 0; i < size && curr != NULL; i++) {
            char item[64];
            snprintf(item, sizeof(item), "%s%d", first ? "" : ",", curr->value);
            first = 0;
            strncat(nodes_buf, item, sizeof(nodes_buf) - strlen(nodes_buf) - 1);
            curr = curr->next;
        }
    }
    strncat(nodes_buf, "]", sizeof(nodes_buf) - strlen(nodes_buf) - 1);

    char head_str[32] = "null";
    char tail_str[32] = "null";
    if (head != NULL) snprintf(head_str, sizeof(head_str), "\"node-%d\"", head->id);
    if (tail != NULL) snprintf(tail_str, sizeof(tail_str), "\"node-%d\"", tail->id);

    snprintf(
        out,
        out_size,
        "{\"size\":%d,\"nodes\":%s,\"head\":%s,\"tail\":%s,\"is_circular\":true}",
        size,
        nodes_buf,
        head_str,
        tail_str
    );
}

char *structurax_cll_execute(
    const int *initial_values,
    int initial_count,
    int operation_type,
    int value,
    int position
) {
    cll_trace_collector_t tc;
    memset(&tc, 0, sizeof(tc));

    // 1. Build initial list
    cll_list_t list;
    list.head = NULL;
    list.tail = NULL;
    list.size = 0;
    list.next_node_id = 0;

    for (int i = 0; i < initial_count; i++) {
        cll_node_t *node = cll_create_node(list.next_node_id++, initial_values[i]);
        if (node == NULL) {
            cll_free_list(list.head, list.tail);
            return NULL;
        }
        if (list.head == NULL) {
            list.head = node;
            list.tail = node;
            node->next = node; // circular self-loop
        } else {
            list.tail->next = node;
            node->next = list.head;
            list.tail = node;
        }
        list.size++;
    }

    char initial_state[1024];
    format_cll_list_state(list.head, list.tail, list.size, initial_state, sizeof(initial_state));

    const char *op_name = "UNKNOWN";
    int is_valid = 1;
    char validation_msg[256] = "Operation completed successfully";

    switch ((cll_operation_type_t)operation_type) {
        case CLL_OP_CREATE: {
            op_name = "CREATE_LIST";
            cll_free_list(list.head, list.tail);
            list.head = NULL;
            list.tail = NULL;
            list.size = 0;
            trace_add_event(&tc, "UPDATE_HEAD", NULL, "{\"action\":\"init_empty\"}", "{\"head\":null,\"tail\":null}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"empty_cll_created\"}", "{}");
            break;
        }

        case CLL_OP_INSERT_FRONT: {
            op_name = "INSERT_FRONT";
            cll_node_t *node = cll_create_node(list.next_node_id++, value);
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
                node->next = node;
                list.size = 1;
                trace_add_event(&tc, "SET_NEXT", nid, "{\"desc\":\"node->next = node (self-loop)\"}", "{}");
                trace_add_event(&tc, "UPDATE_HEAD", nid, "{\"desc\":\"head = node\"}", "{}");
            } else {
                node->next = list.head;
                trace_add_event(&tc, "SET_NEXT", nid, "{\"desc\":\"new_node->next = head\"}", "{}");
                list.tail->next = node;
                char tid[32];
                snprintf(tid, sizeof(tid), "node-%d", list.tail->id);
                trace_add_event(&tc, "SET_NEXT", tid, "{\"desc\":\"tail->next = new_node (circular connection preserved)\"}", "{}");
                list.head = node;
                list.size++;
                trace_add_event(&tc, "UPDATE_HEAD", nid, "{\"desc\":\"head = new_node\"}", "{}");
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{\"status\":\"inserted_front\"}", "{}");
            break;
        }

        case CLL_OP_INSERT_BACK: {
            op_name = "INSERT_BACK";
            cll_node_t *node = cll_create_node(list.next_node_id++, value);
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
                node->next = node;
                list.size = 1;
                trace_add_event(&tc, "UPDATE_HEAD", nid, "{}", "{}");
            } else {
                list.tail->next = node;
                char tid[32];
                snprintf(tid, sizeof(tid), "node-%d", list.tail->id);
                trace_add_event(&tc, "SET_NEXT", tid, "{\"desc\":\"tail->next = new_node\"}", "{}");
                node->next = list.head;
                trace_add_event(&tc, "SET_NEXT", nid, "{\"desc\":\"new_node->next = head (circular link)\"}", "{}");
                list.tail = node;
                list.size++;
                trace_add_event(&tc, "UPDATE_TAIL", nid, "{\"desc\":\"tail = new_node\"}", "{}");
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{\"status\":\"inserted_back\"}", "{}");
            break;
        }

        case CLL_OP_INSERT_AT: {
            op_name = "INSERT_AT";
            if (position < 0 || position > list.size) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Position %d out of bounds for size %d", position, list.size);
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"out_of_bounds\"}", "{}");
                break;
            }
            if (position == 0) {
                cll_node_t *node = cll_create_node(list.next_node_id++, value);
                tc.allocations++;
                char nid[32];
                snprintf(nid, sizeof(nid), "node-%d", node->id);
                trace_add_event(&tc, "ALLOCATE_NODE", nid, "{}", "{}");
                if (list.head == NULL) {
                    list.head = node;
                    list.tail = node;
                    node->next = node;
                } else {
                    node->next = list.head;
                    list.tail->next = node;
                    list.head = node;
                }
                list.size++;
                trace_add_event(&tc, "UPDATE_HEAD", nid, "{}", "{}");
                trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{}", "{}");
            } else if (position == list.size) {
                cll_node_t *node = cll_create_node(list.next_node_id++, value);
                tc.allocations++;
                char nid[32];
                snprintf(nid, sizeof(nid), "node-%d", node->id);
                trace_add_event(&tc, "ALLOCATE_NODE", nid, "{}", "{}");
                list.tail->next = node;
                node->next = list.head;
                list.tail = node;
                list.size++;
                trace_add_event(&tc, "UPDATE_TAIL", nid, "{}", "{}");
                trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{}", "{}");
            } else {
                cll_node_t *curr = list.head;
                for (int i = 0; i < position - 1; i++) {
                    tc.visits++;
                    curr = curr->next;
                }
                cll_node_t *node = cll_create_node(list.next_node_id++, value);
                tc.allocations++;
                char nid[32];
                snprintf(nid, sizeof(nid), "node-%d", node->id);
                trace_add_event(&tc, "ALLOCATE_NODE", nid, "{}", "{}");
                node->next = curr->next;
                curr->next = node;
                list.size++;
                trace_add_event(&tc, "SET_NEXT", nid, "{\"desc\":\"node->next = curr->next\"}", "{}");
                char cid[32];
                snprintf(cid, sizeof(cid), "node-%d", curr->id);
                trace_add_event(&tc, "SET_NEXT", cid, "{\"desc\":\"curr->next = node\"}", "{}");
                trace_add_event(&tc, "OPERATION_COMPLETE", nid, "{}", "{}");
            }
            break;
        }

        case CLL_OP_DELETE_FRONT: {
            op_name = "DELETE_FRONT";
            if (list.head == NULL) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "List is empty");
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"empty_list\"}", "{}");
                break;
            }
            cll_node_t *target = list.head;
            char tid[32];
            snprintf(tid, sizeof(tid), "node-%d", target->id);
            trace_add_event(&tc, "VISIT_NODE", tid, "{\"desc\":\"target_to_delete\"}", "{}");

            if (list.head == list.tail) {
                list.head = NULL;
                list.tail = NULL;
                list.size = 0;
                trace_add_event(&tc, "UPDATE_HEAD", NULL, "{\"desc\":\"list now empty\"}", "{}");
            } else {
                list.head = target->next;
                list.tail->next = list.head;
                list.size--;
                char hid[32];
                snprintf(hid, sizeof(hid), "node-%d", list.head->id);
                char tail_id[32];
                snprintf(tail_id, sizeof(tail_id), "node-%d", list.tail->id);
                trace_add_event(&tc, "UPDATE_HEAD", hid, "{\"desc\":\"head = head->next\"}", "{}");
                trace_add_event(&tc, "SET_NEXT", tail_id, "{\"desc\":\"tail->next = new_head (cycle updated)\"}", "{}");
            }
            trace_add_event(&tc, "RELEASE_NODE", tid, "{}", "{}");
            free(target);
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"deleted_front\"}", "{}");
            break;
        }

        case CLL_OP_DELETE_BACK: {
            op_name = "DELETE_BACK";
            if (list.tail == NULL) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "List is empty");
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"empty_list\"}", "{}");
                break;
            }
            cll_node_t *target = list.tail;
            char tid[32];
            snprintf(tid, sizeof(tid), "node-%d", target->id);
            trace_add_event(&tc, "VISIT_NODE", tid, "{\"desc\":\"target_to_delete\"}", "{}");

            if (list.head == list.tail) {
                list.head = NULL;
                list.tail = NULL;
                list.size = 0;
                trace_add_event(&tc, "UPDATE_TAIL", NULL, "{\"desc\":\"list now empty\"}", "{}");
            } else {
                cll_node_t *curr = list.head;
                while (curr->next != list.tail) {
                    tc.visits++;
                    curr = curr->next;
                }
                curr->next = list.head;
                list.tail = curr;
                list.size--;
                char cid[32];
                snprintf(cid, sizeof(cid), "node-%d", curr->id);
                trace_add_event(&tc, "SET_NEXT", cid, "{\"desc\":\"new_tail->next = head (cycle preserved)\"}", "{}");
                trace_add_event(&tc, "UPDATE_TAIL", cid, "{\"desc\":\"tail = new_tail\"}", "{}");
            }
            trace_add_event(&tc, "RELEASE_NODE", tid, "{}", "{}");
            free(target);
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"deleted_back\"}", "{}");
            break;
        }

        case CLL_OP_DELETE_AT: {
            op_name = "DELETE_AT";
            if (position < 0 || position >= list.size) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Position %d out of bounds for size %d", position, list.size);
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"out_of_bounds\"}", "{}");
                break;
            }
            if (position == 0) {
                cll_node_t *target = list.head;
                char tid[32];
                snprintf(tid, sizeof(tid), "node-%d", target->id);
                trace_add_event(&tc, "VISIT_NODE", tid, "{}", "{}");
                if (list.head == list.tail) {
                    list.head = NULL;
                    list.tail = NULL;
                } else {
                    list.head = target->next;
                    list.tail->next = list.head;
                }
                list.size--;
                trace_add_event(&tc, "RELEASE_NODE", tid, "{}", "{}");
                free(target);
                trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{}", "{}");
            } else {
                cll_node_t *curr = list.head;
                for (int i = 0; i < position - 1; i++) {
                    tc.visits++;
                    curr = curr->next;
                }
                cll_node_t *target = curr->next;
                char tid[32];
                snprintf(tid, sizeof(tid), "node-%d", target->id);
                trace_add_event(&tc, "VISIT_NODE", tid, "{}", "{}");
                curr->next = target->next;
                if (target == list.tail) list.tail = curr;
                list.size--;
                trace_add_event(&tc, "RELEASE_NODE", tid, "{}", "{}");
                free(target);
                trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{}", "{}");
            }
            break;
        }

        case CLL_OP_SEARCH: {
            op_name = "SEARCH";
            int found = 0;
            if (list.head != NULL) {
                cll_node_t *curr = list.head;
                int idx = 0;
                do {
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
                } while (curr != list.head);
            }
            if (!found) {
                snprintf(validation_msg, sizeof(validation_msg), "Value %d not found in circular linked list", value);
                trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"found\":false}", "{}");
            }
            break;
        }

        case CLL_OP_TRAVERSE: {
            op_name = "TRAVERSE";
            if (list.head != NULL) {
                cll_node_t *curr = list.head;
                int idx = 0;
                do {
                    tc.visits++;
                    char cid[32];
                    snprintf(cid, sizeof(cid), "node-%d", curr->id);
                    char payload[128];
                    snprintf(payload, sizeof(payload), "{\"index\":%d,\"value\":%d}", idx++, curr->value);
                    trace_add_event(&tc, "VISIT_NODE", cid, payload, "{}");
                    curr = curr->next;
                } while (curr != list.head); // safely terminates when circular loop returns to head!
                char tid[32];
                snprintf(tid, sizeof(tid), "node-%d", list.tail->id);
                trace_add_event(&tc, "VISIT_NODE", tid, "{\"desc\":\"cycle_loop_detected_returned_to_head\"}", "{\"circle_closed\":true}");
            }
            trace_add_event(&tc, "TRAVERSE_COMPLETE", NULL, "{\"status\":\"circular_cycle_traversed\"}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"traversal_done\"}", "{}");
            break;
        }

        case CLL_OP_REVERSE: {
            op_name = "REVERSE";
            if (list.size <= 1) {
                trace_add_event(&tc, "OPERATION_COMPLETE", list.head ? "node-0" : NULL, "{\"status\":\"trivial_cll_reversed\"}", "{}");
                break;
            }
            cll_node_t *prev = list.tail;
            cll_node_t *curr = list.head;
            cll_node_t *next = NULL;
            cll_node_t *old_head = list.head;
            do {
                tc.visits++;
                char cid[32];
                snprintf(cid, sizeof(cid), "node-%d", curr->id);
                next = curr->next;
                curr->next = prev;
                trace_add_event(&tc, "SET_NEXT", cid, "{\"desc\":\"reversed circular pointer\"}", "{}");
                prev = curr;
                curr = next;
            } while (curr != old_head);

            list.head = list.tail;
            list.tail = old_head;
            char hid[32];
            snprintf(hid, sizeof(hid), "node-%d", list.head->id);
            trace_add_event(&tc, "UPDATE_HEAD", hid, "{\"desc\":\"head = old_tail\"}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", hid, "{\"status\":\"reversed_circular_list\"}", "{}");
            break;
        }

        case CLL_OP_MERGE: {
            op_name = "MERGE";
            cll_node_t *sec = cll_create_node(list.next_node_id++, value > 0 ? value : 77);
            tc.allocations++;
            char sid[32];
            snprintf(sid, sizeof(sid), "node-%d", sec->id);
            trace_add_event(&tc, "ALLOCATE_NODE", sid, "{\"desc\":\"second_cll_node\"}", "{}");

            if (list.head == NULL) {
                list.head = sec;
                list.tail = sec;
                sec->next = sec;
                list.size = 1;
                trace_add_event(&tc, "UPDATE_HEAD", sid, "{}", "{}");
            } else {
                sec->next = list.head;
                list.tail->next = sec;
                list.tail = sec;
                list.size++;
                trace_add_event(&tc, "SET_NEXT", sid, "{\"desc\":\"second_node->next = head (circular)\"}", "{}");
                char tid[32];
                snprintf(tid, sizeof(tid), "node-%d", sec->id);
                trace_add_event(&tc, "UPDATE_TAIL", tid, "{}", "{}");
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", sid, "{\"status\":\"merged_circular_lists\"}", "{}");
            break;
        }

        case CLL_OP_DISPLAY:
        default: {
            op_name = "DISPLAY";
            trace_add_event(&tc, "VISIT_NODE", list.head ? "node-0" : NULL, "{\"desc\":\"displaying_cll_state\"}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"displayed\"}", "{}");
            break;
        }
    }

    char final_state[1024];
    format_cll_list_state(list.head, list.tail, list.size, final_state, sizeof(final_state));

    cll_free_list(list.head, list.tail);

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
        "\"operation_id\":\"cll-%s-%d\","
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
