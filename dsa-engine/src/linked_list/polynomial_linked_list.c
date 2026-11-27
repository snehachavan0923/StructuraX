#include "polynomial_linked_list.h"
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
} poly_trace_collector_t;

static void trace_add_event(
    poly_trace_collector_t *tc,
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

static poly_node_t *poly_create_node(int id, int coeff, int exp) {
    poly_node_t *node = (poly_node_t *)malloc(sizeof(poly_node_t));
    if (node == NULL) return NULL;
    node->id = id;
    node->coeff = coeff;
    node->exp = exp;
    node->next = NULL;
    return node;
}

static void poly_free_list(poly_node_t *head) {
    poly_node_t *curr = head;
    while (curr != NULL) {
        poly_node_t *next = curr->next;
        free(curr);
        curr = next;
    }
}

static void format_poly_state(poly_node_t *head, int size, char *out, size_t out_size) {
    char terms_buf[8192] = "[";
    char str_repr[2048] = "";
    poly_node_t *curr = head;
    int first = 1;
    while (curr != NULL) {
        char item[64];
        snprintf(item, sizeof(item), "%s{\"coeff\":%d,\"exp\":%d}", first ? "" : ",", curr->coeff, curr->exp);
        strncat(terms_buf, item, sizeof(terms_buf) - strlen(terms_buf) - 1);

        char term_str[64];
        if (curr->exp == 0) {
            snprintf(term_str, sizeof(term_str), "%s%d", first ? "" : " + ", curr->coeff);
        } else if (curr->exp == 1) {
            snprintf(term_str, sizeof(term_str), "%s%dx", first ? "" : " + ", curr->coeff);
        } else {
            snprintf(term_str, sizeof(term_str), "%s%dx^%d", first ? "" : " + ", curr->coeff, curr->exp);
        }
        strncat(str_repr, term_str, sizeof(str_repr) - strlen(str_repr) - 1);

        first = 0;
        curr = curr->next;
    }
    strncat(terms_buf, "]", sizeof(terms_buf) - strlen(terms_buf) - 1);

    if (size == 0) {
        snprintf(str_repr, sizeof(str_repr), "0");
    }

    snprintf(
        out,
        out_size,
        "{\"size\":%d,\"terms\":%s,\"expression\":\"%s\"}",
        size,
        terms_buf,
        str_repr
    );
}

char *structurax_poly_execute(
    const int *coeffs1,
    const int *exps1,
    int count1,
    const int *coeffs2,
    const int *exps2,
    int count2,
    int operation_type
) {
    poly_trace_collector_t tc;
    memset(&tc, 0, sizeof(tc));

    poly_list_t poly1;
    poly1.head = NULL;
    poly1.size = 0;
    poly1.next_node_id = 0;

    poly_node_t *tail1 = NULL;
    for (int i = 0; i < count1; i++) {
        if (coeffs1[i] == 0) continue;
        poly_node_t *node = poly_create_node(poly1.next_node_id++, coeffs1[i], exps1[i]);
        if (!node) {
            poly_free_list(poly1.head);
            return NULL;
        }
        if (poly1.head == NULL) {
            poly1.head = node;
            tail1 = node;
        } else {
            tail1->next = node;
            tail1 = node;
        }
        poly1.size++;
    }

    poly_list_t poly2;
    poly2.head = NULL;
    poly2.size = 0;
    poly2.next_node_id = 100;

    poly_node_t *tail2 = NULL;
    for (int i = 0; i < count2; i++) {
        if (coeffs2[i] == 0) continue;
        poly_node_t *node = poly_create_node(poly2.next_node_id++, coeffs2[i], exps2[i]);
        if (!node) {
            poly_free_list(poly1.head);
            poly_free_list(poly2.head);
            return NULL;
        }
        if (poly2.head == NULL) {
            poly2.head = node;
            tail2 = node;
        } else {
            tail2->next = node;
            tail2 = node;
        }
        poly2.size++;
    }

    char initial_state[1024];
    format_poly_state(poly1.head, poly1.size, initial_state, sizeof(initial_state));

    poly_list_t result;
    result.head = NULL;
    result.size = 0;
    result.next_node_id = 200;
    poly_node_t *res_tail = NULL;

    const char *op_name = "UNKNOWN";
    int is_valid = 1;
    char validation_msg[256] = "Polynomial operation completed successfully";

    switch ((poly_operation_type_t)operation_type) {
        case POLY_OP_CREATE:
        case POLY_OP_DISPLAY: {
            op_name = "DISPLAY";
            trace_add_event(&tc, "VISIT_NODE", poly1.head ? "node-0" : NULL, "{\"desc\":\"displaying_polynomial_terms\"}", "{}");
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"displayed\"}", "{}");
            // Result is same as poly1
            poly_node_t *c = poly1.head;
            while (c != NULL) {
                poly_node_t *n = poly_create_node(result.next_node_id++, c->coeff, c->exp);
                if (result.head == NULL) { result.head = n; res_tail = n; }
                else { res_tail->next = n; res_tail = n; }
                result.size++;
                c = c->next;
            }
            break;
        }

        case POLY_OP_ADD: {
            op_name = "ADD";
            poly_node_t *p1 = poly1.head;
            poly_node_t *p2 = poly2.head;

            while (p1 != NULL || p2 != NULL) {
                tc.visits++;
                if (p1 != NULL && p2 != NULL && p1->exp == p2->exp) {
                    int sum_c = p1->coeff + p2->coeff;
                    char cmp[128];
                    snprintf(cmp, sizeof(cmp), "{\"action\":\"match_exp\",\"exp\":%d,\"sum_coeff\":%d}", p1->exp, sum_c);
                    trace_add_event(&tc, "COMPARE", NULL, cmp, "{\"combined\":true}");
                    if (sum_c != 0) {
                        poly_node_t *n = poly_create_node(result.next_node_id++, sum_c, p1->exp);
                        tc.allocations++;
                        if (result.head == NULL) { result.head = n; res_tail = n; }
                        else { res_tail->next = n; res_tail = n; }
                        result.size++;
                    }
                    p1 = p1->next;
                    p2 = p2->next;
                } else if (p2 == NULL || (p1 != NULL && p1->exp > p2->exp)) {
                    poly_node_t *n = poly_create_node(result.next_node_id++, p1->coeff, p1->exp);
                    tc.allocations++;
                    char pl[128];
                    snprintf(pl, sizeof(pl), "{\"action\":\"take_p1\",\"coeff\":%d,\"exp\":%d}", p1->coeff, p1->exp);
                    trace_add_event(&tc, "VISIT_NODE", NULL, pl, "{}");
                    if (result.head == NULL) { result.head = n; res_tail = n; }
                    else { res_tail->next = n; res_tail = n; }
                    result.size++;
                    p1 = p1->next;
                } else {
                    poly_node_t *n = poly_create_node(result.next_node_id++, p2->coeff, p2->exp);
                    tc.allocations++;
                    char pl[128];
                    snprintf(pl, sizeof(pl), "{\"action\":\"take_p2\",\"coeff\":%d,\"exp\":%d}", p2->coeff, p2->exp);
                    trace_add_event(&tc, "VISIT_NODE", NULL, pl, "{}");
                    if (result.head == NULL) { result.head = n; res_tail = n; }
                    else { res_tail->next = n; res_tail = n; }
                    result.size++;
                    p2 = p2->next;
                }
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"polynomials_added\"}", "{}");
            break;
        }

        case POLY_OP_SUBTRACT: {
            op_name = "SUBTRACT";
            poly_node_t *p1 = poly1.head;
            poly_node_t *p2 = poly2.head;

            while (p1 != NULL || p2 != NULL) {
                tc.visits++;
                if (p1 != NULL && p2 != NULL && p1->exp == p2->exp) {
                    int diff_c = p1->coeff - p2->coeff;
                    char cmp[128];
                    snprintf(cmp, sizeof(cmp), "{\"action\":\"match_exp\",\"exp\":%d,\"diff_coeff\":%d}", p1->exp, diff_c);
                    trace_add_event(&tc, "COMPARE", NULL, cmp, "{\"combined\":true}");
                    if (diff_c != 0) {
                        poly_node_t *n = poly_create_node(result.next_node_id++, diff_c, p1->exp);
                        tc.allocations++;
                        if (result.head == NULL) { result.head = n; res_tail = n; }
                        else { res_tail->next = n; res_tail = n; }
                        result.size++;
                    }
                    p1 = p1->next;
                    p2 = p2->next;
                } else if (p2 == NULL || (p1 != NULL && p1->exp > p2->exp)) {
                    poly_node_t *n = poly_create_node(result.next_node_id++, p1->coeff, p1->exp);
                    tc.allocations++;
                    if (result.head == NULL) { result.head = n; res_tail = n; }
                    else { res_tail->next = n; res_tail = n; }
                    result.size++;
                    p1 = p1->next;
                } else {
                    poly_node_t *n = poly_create_node(result.next_node_id++, -p2->coeff, p2->exp);
                    tc.allocations++;
                    if (result.head == NULL) { result.head = n; res_tail = n; }
                    else { res_tail->next = n; res_tail = n; }
                    result.size++;
                    p2 = p2->next;
                }
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"polynomials_subtracted\"}", "{}");
            break;
        }

        case POLY_OP_MULTIPLY: {
            op_name = "MULTIPLY";
            // Accumulate in an exponent array up to degree 100
            int max_deg = 100;
            int accum[101] = {0};

            for (poly_node_t *p1 = poly1.head; p1 != NULL; p1 = p1->next) {
                for (poly_node_t *p2 = poly2.head; p2 != NULL; p2 = p2->next) {
                    tc.visits++;
                    int new_e = p1->exp + p2->exp;
                    int new_c = p1->coeff * p2->coeff;
                    if (new_e <= max_deg) {
                        accum[new_e] += new_c;
                    }
                }
            }

            for (int e = max_deg; e >= 0; e--) {
                if (accum[e] != 0) {
                    poly_node_t *n = poly_create_node(result.next_node_id++, accum[e], e);
                    tc.allocations++;
                    if (result.head == NULL) { result.head = n; res_tail = n; }
                    else { res_tail->next = n; res_tail = n; }
                    result.size++;
                }
            }
            trace_add_event(&tc, "OPERATION_COMPLETE", NULL, "{\"status\":\"polynomials_multiplied\"}", "{}");
            break;
        }
    }

    char final_state[1024];
    format_poly_state(result.head, result.size, final_state, sizeof(final_state));

    poly_free_list(poly1.head);
    poly_free_list(poly2.head);
    poly_free_list(result.head);

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
        "\"operation_id\":\"poly-%s-%d\","
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
