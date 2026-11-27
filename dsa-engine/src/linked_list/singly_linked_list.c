#include "singly_linked_list.h"
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
} sll_trace_collector_t;

static void trace_add_event(
    sll_trace_collector_t *tc,
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

static sll_node_t *sll_create_node(int id, int value) {
    sll_node_t *node = (sll_node_t *)malloc(sizeof(sll_node_t));
    if (node == NULL) return NULL;
    node->id = id;
    node->value = value;
    node->next = NULL;
    return node;
}

static void sll_free_list(sll_node_t *head) {
    sll_node_t *curr = head;
    while (curr != NULL) {
        sll_node_t *next = curr->next;
        free(curr);
        curr = next;
    }
}

static void format_list_state(sll_node_t *head, int size, char *out, size_t out_size) {
    char nodes_buf[8192] = "[";
    sll_node_t *curr = head;
    int first = 1;
    while (curr != NULL) {
        char item[64];
        snprintf(item, sizeof(item), "%s%d", first ? "" : ",", curr->value);
        first = 0;
        strncat(nodes_buf, item, sizeof(nodes_buf) - strlen(nodes_buf) - 1);
        curr = curr->next;
    }
    strncat(nodes_buf, "]", sizeof(nodes_buf) - strlen(nodes_buf) - 1);

    snprintf(
        out,
        out_size,
        "{\"size\":%d,\"nodes\":%s,\"head\":%s}",
        size,
        nodes_buf,
        head != NULL ? "\"node-0\"" : "null"
    );
}

char *structurax_sll_execute(
    const int *initial_values,
    int initial_count,
    int operation_type,
    int value,
    int position
) {
    sll_trace_collector_t tc;
    memset(&tc, 0, sizeof(tc));

    // 1. Build initial list
    sll_list_t list;
    list.head = NULL;
    list.size = 0;
    list.next_node_id = 0;

    sll_node_t *tail = NULL;
    for (int i = 0; i < initial_count; i++) {
        sll_node_t *node = sll_create_node(list.next_node_id++, initial_values[i]);
        if (node == NULL) {
            sll_free_list(list.head);
            return NULL;
        }
        if (list.head == NULL) {
            list.head = node;
            tail = node;
        } else {
            tail->next = node;
            tail = node;
        }
        list.size++;
    }

    char initial_state[1024];
    format_list_state(list.head, list.size, initial_state, sizeof(initial_state));

    const char *op_name = "UNKNOWN";
    int is_valid = 1;
    char validation_msg[256] = "Operation completed successfully";

    // 2. Perform requested operation and emit events
    switch ((sll_operation_type_t)operation_type) {
        case SLL_OP_CREATE: {
            op_name = "CREATE_LIST";
            sll_free_list(list.head);
            list.head = NULL;
            list.size = 0;
            trace_add_event(&tc, "UPDATE_HEAD", NULL, "{\"action\":\"init_empty\"}", "{\"head\":null}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"empty_list_created\"}", "{\"head\":null}");
            break;
        }

        case SLL_OP_INSERT_FRONT: {
            op_name = "INSERT_FRONT";
            sll_node_t *new_node = sll_create_node(list.next_node_id++, value);
            if (!new_node) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Memory allocation failed");
                break;
            }
            tc.allocations++;
            char node_id_str[32];
            snprintf(node_id_str, sizeof(node_id_str), "node-%d", new_node->id);

            char payload[128];
            snprintf(payload, sizeof(payload), "{\"value\":%d,\"address\":\"0x%X\"}", value, 0x10 + new_node->id * 0x10);
            trace_add_event(&tc, "ALLOCATE_NODE", node_id_str, payload, "{\"head\":null,\"next\":null}");

            new_node->next = list.head;
            char ptrs[128];
            snprintf(ptrs, sizeof(ptrs), "{\"head\":%s,\"next\":%s}",
                     list.head ? "\"node-prev-head\"" : "null",
                     list.head ? "\"node-prev-head\"" : "null");
            trace_add_event(&tc, "SET_NEXT", node_id_str, "{\"desc\":\"new_node->next = head\"}", ptrs);

            list.head = new_node;
            list.size++;
            trace_add_event(&tc, "UPDATE_HEAD", node_id_str, "{\"desc\":\"head = new_node\"}", "{\"head\":\"new_node\"}");
            char complete_payload[64];
            snprintf(complete_payload, sizeof(complete_payload), "{\"inserted_value\":%d}", value);
            trace_add_event(&tc, "OPERATION_COMPLETE", node_id_str, complete_payload, "{\"head\":\"node-0\"}");
            break;
        }

        case SLL_OP_INSERT_BACK: {
            op_name = "INSERT_BACK";
            sll_node_t *new_node = sll_create_node(list.next_node_id++, value);
            if (!new_node) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Memory allocation failed");
                break;
            }
            tc.allocations++;
            char node_id_str[32];
            snprintf(node_id_str, sizeof(node_id_str), "node-%d", new_node->id);

            char payload[128];
            snprintf(payload, sizeof(payload), "{\"value\":%d,\"address\":\"0x%X\"}", value, 0x10 + new_node->id * 0x10);
            trace_add_event(&tc, "ALLOCATE_NODE", node_id_str, payload, "{\"next\":null}");

            if (list.head == NULL) {
                list.head = new_node;
                list.size = 1;
                trace_add_event(&tc, "UPDATE_HEAD", node_id_str, "{\"desc\":\"list was empty, head = new_node\"}", "{\"head\":\"new_node\"}");
            } else {
                sll_node_t *curr = list.head;
                int idx = 0;
                while (curr->next != NULL) {
                    tc.visits++;
                    char curr_id[32];
                    snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                    char visit_payload[128];
                    snprintf(visit_payload, sizeof(visit_payload), "{\"index\":%d,\"value\":%d}", idx, curr->value);
                    trace_add_event(&tc, "VISIT_NODE", curr_id, visit_payload, "{\"curr\":\"active\"}");
                    curr = curr->next;
                    idx++;
                }
                tc.visits++;
                char tail_id[32];
                snprintf(tail_id, sizeof(tail_id), "node-%d", curr->id);
                trace_add_event(&tc, "VISIT_NODE", tail_id, "{\"desc\":\"tail found\"}", "{\"curr\":\"tail\"}");

                curr->next = new_node;
                list.size++;
                char ptrs[128];
                snprintf(ptrs, sizeof(ptrs), "{\"tail\":\"%s\",\"tail->next\":\"%s\"}", tail_id, node_id_str);
                trace_add_event(&tc, "SET_NEXT", tail_id, "{\"desc\":\"tail->next = new_node\"}", ptrs);
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", node_id_str, "{\"status\":\"inserted_back\"}", "{\"tail\":\"new_node\"}");
            break;
        }

        case SLL_OP_INSERT_AT: {
            op_name = "INSERT_AT";
            if (position < 0 || position > list.size) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Invalid position %d for list of size %d", position, list.size);
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"out_of_bounds\"}", "{}");
                break;
            }

            if (position == 0) {
                sll_node_t *new_node = sll_create_node(list.next_node_id++, value);
                tc.allocations++;
                char node_id_str[32];
                snprintf(node_id_str, sizeof(node_id_str), "node-%d", new_node->id);
                trace_add_event(&tc, "ALLOCATE_NODE", node_id_str, "{\"position\":0}", "{}");
                new_node->next = list.head;
                list.head = new_node;
                list.size++;
                trace_add_event(&tc, "UPDATE_HEAD", node_id_str, "{\"desc\":\"head updated\"}", "{\"head\":\"new_node\"}");
                trace_add_event(&tc, "OPERATION_COMPLETE", node_id_str, "{\"position\":0}", "{}");
            } else {
                sll_node_t *curr = list.head;
                for (int i = 0; i < position - 1 && curr != NULL; i++) {
                    tc.visits++;
                    char curr_id[32];
                    snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                    trace_add_event(&tc, "VISIT_NODE", curr_id, "{\"seeking_position\":true}", "{\"curr\":\"active\"}");
                    curr = curr->next;
                }
                sll_node_t *new_node = sll_create_node(list.next_node_id++, value);
                tc.allocations++;
                char node_id_str[32];
                snprintf(node_id_str, sizeof(node_id_str), "node-%d", new_node->id);
                trace_add_event(&tc, "ALLOCATE_NODE", node_id_str, "{\"action\":\"alloc_for_insert\"}", "{}");

                new_node->next = curr->next;
                trace_add_event(&tc, "SET_NEXT", node_id_str, "{\"desc\":\"new_node->next = curr->next\"}", "{}");
                curr->next = new_node;
                list.size++;
                char curr_id[32];
                snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                trace_add_event(&tc, "SET_NEXT", curr_id, "{\"desc\":\"curr->next = new_node\"}", "{}");
                char alloc_payload[64];
                snprintf(alloc_payload, sizeof(alloc_payload), "{\"position\":%d}", position);
                trace_add_event(&tc, "OPERATION_COMPLETE", node_id_str, alloc_payload, "{}");
            }
            break;
        }

        case SLL_OP_DELETE_FRONT: {
            op_name = "DELETE_FRONT";
            if (list.head == NULL) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Cannot delete from an empty list");
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"list_empty\"}", "{\"head\":null}");
                break;
            }

            sll_node_t *target = list.head;
            char target_id[32];
            snprintf(target_id, sizeof(target_id), "node-%d", target->id);
            trace_add_event(&tc, "VISIT_NODE", target_id, "{\"action\":\"target_for_deletion\"}", "{\"head\":\"active\"}");

            list.head = target->next;
            list.size--;
            char new_head_id[32];
            if (list.head) snprintf(new_head_id, sizeof(new_head_id), "node-%d", list.head->id);
            else snprintf(new_head_id, sizeof(new_head_id), "null");

            trace_add_event(&tc, "UPDATE_HEAD", list.head ? new_head_id : NULL, "{\"desc\":\"head = head->next\"}", "{\"head\":\"new_head\"}");
            char freed_payload[64];
            snprintf(freed_payload, sizeof(freed_payload), "{\"freed_value\":%d}", target->value);
            trace_add_event(&tc, "RELEASE_NODE", target_id, freed_payload, "{}");
            free(target);
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"deleted_front\"}", "{}");
            break;
        }

        case SLL_OP_DELETE_BACK: {
            op_name = "DELETE_BACK";
            if (list.head == NULL) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Cannot delete from an empty list");
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"list_empty\"}", "{\"head\":null}");
                break;
            }

            if (list.head->next == NULL) {
                sll_node_t *target = list.head;
                char target_id[32];
                snprintf(target_id, sizeof(target_id), "node-%d", target->id);
                trace_add_event(&tc, "VISIT_NODE", target_id, "{\"single_node\":true}", "{}");
                list.head = NULL;
                list.size = 0;
                trace_add_event(&tc, "UPDATE_HEAD", NULL, "{\"desc\":\"head = null\"}", "{\"head\":null}");
                char freed_payload[64];
            snprintf(freed_payload, sizeof(freed_payload), "{\"freed_value\":%d}", target->value);
            trace_add_event(&tc, "RELEASE_NODE", target_id, freed_payload, "{}");
                free(target);
            } else {
                sll_node_t *curr = list.head;
                while (curr->next->next != NULL) {
                    tc.visits++;
                    char curr_id[32];
                    snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                    trace_add_event(&tc, "VISIT_NODE", curr_id, "{\"seeking_second_last\":true}", "{}");
                    curr = curr->next;
                }
                sll_node_t *target = curr->next;
                char target_id[32];
                snprintf(target_id, sizeof(target_id), "node-%d", target->id);
                trace_add_event(&tc, "VISIT_NODE", target_id, "{\"tail_found\":true}", "{}");
                curr->next = NULL;
                list.size--;
                char curr_id[32];
                snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                trace_add_event(&tc, "SET_NEXT", curr_id, "{\"desc\":\"curr->next = NULL\"}", "{\"next\":null}");
                char freed_payload[64];
            snprintf(freed_payload, sizeof(freed_payload), "{\"freed_value\":%d}", target->value);
            trace_add_event(&tc, "RELEASE_NODE", target_id, freed_payload, "{}");
                free(target);
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"deleted_back\"}", "{}");
            break;
        }

        case SLL_OP_DELETE_AT: {
            op_name = "DELETE_AT";
            if (position < 0 || position >= list.size) {
                is_valid = 0;
                snprintf(validation_msg, sizeof(validation_msg), "Invalid index %d for list of size %d", position, list.size);
                trace_add_event(&tc, "OPERATION_ERROR", NULL, "{\"error\":\"out_of_bounds\"}", "{}");
                break;
            }

            if (position == 0) {
                sll_node_t *target = list.head;
                char target_id[32];
                snprintf(target_id, sizeof(target_id), "node-%d", target->id);
                trace_add_event(&tc, "VISIT_NODE", target_id, "{\"delete_position\":0}", "{}");
                list.head = target->next;
                list.size--;
                trace_add_event(&tc, "UPDATE_HEAD", list.head ? "node-next" : NULL, "{\"desc\":\"head = head->next\"}", "{}");
                char freed_payload[64];
            snprintf(freed_payload, sizeof(freed_payload), "{\"freed_value\":%d}", target->value);
            trace_add_event(&tc, "RELEASE_NODE", target_id, freed_payload, "{}");
                free(target);
            } else {
                sll_node_t *curr = list.head;
                for (int i = 0; i < position - 1; i++) {
                    tc.visits++;
                    char curr_id[32];
                    snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                    trace_add_event(&tc, "VISIT_NODE", curr_id, "{\"traverse_to_index\":true}", "{}");
                    curr = curr->next;
                }
                sll_node_t *target = curr->next;
                char target_id[32];
                snprintf(target_id, sizeof(target_id), "node-%d", target->id);
                trace_add_event(&tc, "VISIT_NODE", target_id, "{\"target_at_position\":true}", "{}");
                curr->next = target->next;
                list.size--;
                char curr_id[32];
                snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                trace_add_event(&tc, "SET_NEXT", curr_id, "{\"desc\":\"curr->next = target->next\"}", "{}");
                char freed_payload[64];
            snprintf(freed_payload, sizeof(freed_payload), "{\"freed_value\":%d}", target->value);
            trace_add_event(&tc, "RELEASE_NODE", target_id, freed_payload, "{}");
                free(target);
            }
            char del_pos_payload[64];
            snprintf(del_pos_payload, sizeof(del_pos_payload), "{\"deleted_position\":%d}", position);
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, del_pos_payload, "{}");
            break;
        }

        case SLL_OP_SEARCH: {
            op_name = "SEARCH";
            sll_node_t *curr = list.head;
            int idx = 0;
            int found = 0;
            while (curr != NULL) {
                tc.visits++;
                char curr_id[32];
                snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                char compare_payload[128];
                snprintf(compare_payload, sizeof(compare_payload), "{\"index\":%d,\"node_value\":%d,\"target\":%d}", idx, curr->value, value);
                trace_add_event(&tc, "COMPARE", curr_id, compare_payload, "{\"curr\":\"active\"}");

                if (curr->value == value) {
                    found = 1;
                    char match_payload[128];
                    snprintf(match_payload, sizeof(match_payload), "{\"found\":true,\"index\":%d,\"value\":%d}", idx, value);
                    trace_add_event(&tc, "OPERATION_COMPLETE", curr_id, match_payload, "{\"found\":true}");
                    break;
                }
                curr = curr->next;
                idx++;
            }
            if (!found) {
                is_valid = 1; // valid search, just negative result
                snprintf(validation_msg, sizeof(validation_msg), "Value %d not found in linked list", value);
                char not_found_payload[64];
                snprintf(not_found_payload, sizeof(not_found_payload), "{\"found\":false,\"searched_value\":%d}", value);
                trace_add_event(&tc, "OPERATION_COMPLETE", NULL, not_found_payload, "{\"found\":false}");
            }
            break;
        }

        case SLL_OP_TRAVERSE: {
            op_name = "TRAVERSE";
            sll_node_t *curr = list.head;
            int idx = 0;
            while (curr != NULL) {
                tc.visits++;
                char curr_id[32];
                snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                char payload[128];
                snprintf(payload, sizeof(payload), "{\"index\":%d,\"value\":%d}", idx, curr->value);
                trace_add_event(&tc, "VISIT_NODE", curr_id, payload, "{\"curr\":\"visiting\"}");
                curr = curr->next;
                idx++;
            }
            char trav_payload[64];
            snprintf(trav_payload, sizeof(trav_payload), "{\"visited_count\":%d}", idx);
            trace_add_event(&tc, "TRAVERSE_COMPLETE", NULL, trav_payload, "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"traversed_all_nodes\"}", "{}");
            break;
        }

        case SLL_OP_REVERSE_ITERATIVE: {
            op_name = "REVERSE_ITERATIVE";
            if (list.head == NULL || list.head->next == NULL) {
                trace_add_event(&tc, "OPERATION_COMPLETE", list.head ? "node-0" : NULL, "{\"desc\":\"list trivial, no reversal needed\"}", "{}");
                break;
            }

            sll_node_t *prev = NULL;
            sll_node_t *curr = list.head;
            sll_node_t *next = NULL;

            while (curr != NULL) {
                tc.visits++;
                char curr_id[32];
                snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);

                next = curr->next;
                char next_id[32];
                if (next) snprintf(next_id, sizeof(next_id), "\"node-%d\"", next->id);
                else snprintf(next_id, sizeof(next_id), "null");

                char prev_id[32];
                if (prev) snprintf(prev_id, sizeof(prev_id), "\"node-%d\"", prev->id);
                else snprintf(prev_id, sizeof(prev_id), "null");

                char ptr_payload[128];
                snprintf(ptr_payload, sizeof(ptr_payload), "{\"curr\":\"%s\",\"next\":%s,\"prev\":%s}", curr_id, next_id, prev_id);
                trace_add_event(&tc, "UPDATE_POINTER", curr_id, ptr_payload, "{\"status\":\"caching_next\"}");

                curr->next = prev;
                char set_payload[128];
                snprintf(set_payload, sizeof(set_payload), "{\"desc\":\"curr->next = prev\",\"target\":%s}", prev_id);
                trace_add_event(&tc, "SET_NEXT", curr_id, set_payload, "{\"reversed\":true}");

                prev = curr;
                curr = next;
            }

            list.head = prev;
            char new_head_id[32];
            snprintf(new_head_id, sizeof(new_head_id), "node-%d", prev->id);
            trace_add_event(&tc, "UPDATE_HEAD", new_head_id, "{\"desc\":\"head = prev\"}", "{\"head\":\"new_reversed_head\"}");
            trace_add_event(&tc, "OPERATION_COMPLETE", new_head_id, "{\"status\":\"reversed_iterative\"}", "{}");
            break;
        }

        case SLL_OP_REVERSE_RECURSIVE: {
            op_name = "REVERSE_RECURSIVE";
            if (list.head == NULL || list.head->next == NULL) {
                trace_add_event(&tc, "OPERATION_COMPLETE", list.head ? "node-0" : NULL, "{\"desc\":\"list trivial, no reversal needed\"}", "{}");
                break;
            }

            // Trace recursive calls pushing onto the stack
            sll_node_t *curr = list.head;
            int depth = 0;
            while (curr != NULL) {
                tc.visits++;
                char curr_id[32];
                snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                char call_payload[128];
                snprintf(call_payload, sizeof(call_payload), "{\"recursion_depth\":%d,\"action\":\"call_reverse\"}", depth++);
                trace_add_event(&tc, "VISIT_NODE", curr_id, call_payload, "{\"call_stack\":\"push\"}");
                curr = curr->next;
            }

            // Reverse pointers iteratively simulating the return unwinding
            sll_node_t *prev = NULL;
            curr = list.head;
            while (curr != NULL) {
                sll_node_t *next = curr->next;
                curr->next = prev;
                prev = curr;
                curr = next;
                char unwind_id[32];
                snprintf(unwind_id, sizeof(unwind_id), "node-%d", prev->id);
                trace_add_event(&tc, "SET_NEXT", unwind_id, "{\"action\":\"unwind_link\",\"desc\":\"node->next->next = node\"}", "{\"call_stack\":\"pop\"}");
            }
            list.head = prev;
            char head_id[32];
            snprintf(head_id, sizeof(head_id), "node-%d", prev->id);
            trace_add_event(&tc, "UPDATE_HEAD", head_id, "{\"desc\":\"base case returns tail as new head\"}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", head_id, "{\"status\":\"reversed_recursive\"}", "{}");
            break;
        }

        case SLL_OP_MERGE: {
            op_name = "MERGE";
            sll_node_t *second_node = sll_create_node(list.next_node_id++, value > 0 ? value : 88);
            tc.allocations++;
            char sec_id[32];
            snprintf(sec_id, sizeof(sec_id), "node-%d", second_node->id);
            trace_add_event(&tc, "ALLOCATE_NODE", sec_id, "{\"desc\":\"second_list_node_to_merge\"}", "{}");

            if (list.head == NULL) {
                list.head = second_node;
                list.size = 1;
                trace_add_event(&tc, "UPDATE_HEAD", sec_id, "{\"desc\":\"head = second_list\"}", "{}");
            } else {
                sll_node_t *curr = list.head;
                while (curr->next != NULL) {
                    tc.visits++;
                    curr = curr->next;
                }
                curr->next = second_node;
                list.size++;
                char curr_id[32];
                snprintf(curr_id, sizeof(curr_id), "node-%d", curr->id);
                trace_add_event(&tc, "SET_NEXT", curr_id, "{\"desc\":\"tail->next = second_list->head\"}", "{}");
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", sec_id, "{\"status\":\"lists_merged\"}", "{}");
            break;
        }

        case SLL_OP_DISPLAY:
        default: {
            op_name = "DISPLAY";
            trace_add_event(&tc, "VISIT_NODE", list.head ? "node-0" : NULL, "{\"desc\":\"displaying_current_state\"}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"displayed\"}", "{}");
            break;
        }
    }

    // 3. Final State representation
    char final_state[1024];
    format_list_state(list.head, list.size, final_state, sizeof(final_state));

    // Cleanup list memory safely
    sll_free_list(list.head);

    // 4. Construct complete JSON response
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
        "\"operation_id\":\"sll-%s-%d\","
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
