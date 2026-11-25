#include "structurax_engine.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *structurax_test_operation(int left, int right)
{
    char buffer[2048];
    int written = snprintf(
        buffer,
        sizeof(buffer),
        "{\"schema_version\":\"1.0.0\","
        "\"operation_id\":\"test-add-0001\","
        "\"operation\":\"TEST_ADD\","
        "\"initial_state\":{\"left\":%d,\"right\":%d},"
        "\"final_state\":{\"sum\":%d},"
        "\"events\":["
        "{\"step\":1,\"event_type\":\"VISIT_NODE\",\"node_id\":\"left\","
        "\"payload\":{\"value\":%d},\"pointers\":{\"left\":\"left\"},"
        "\"counters\":{\"visits\":1,\"allocations\":0}},"
        "{\"step\":2,\"event_type\":\"VISIT_NODE\",\"node_id\":\"right\","
        "\"payload\":{\"value\":%d},\"pointers\":{\"right\":\"right\"},"
        "\"counters\":{\"visits\":2,\"allocations\":0}},"
        "{\"step\":3,\"event_type\":\"TEST_SUM\",\"node_id\":null,"
        "\"payload\":{\"result\":%d},\"pointers\":{},"
        "\"counters\":{\"visits\":2,\"allocations\":0}}"
        "],"
        "\"validation\":{\"valid\":true,\"message\":\"test operation completed\"},"
        "\"counters\":{\"visits\":2,\"allocations\":0,\"steps\":3}}",
        left, right, left + right, left, right, left + right);

    if (written < 0 || (size_t)written >= sizeof(buffer))
    {
        return NULL;
    }

    char *result = (char *)malloc((size_t)written + 1);
    if (result == NULL)
    {
        return NULL;
    }
    memcpy(result, buffer, (size_t)written + 1);
    return result;
}
