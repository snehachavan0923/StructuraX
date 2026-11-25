#include "structurax_engine.h"

#include <assert.h>
#include <string.h>

int main(void)
{
    assert(strcmp(structurax_engine_version(), "0.1.0") == 0);
    assert(structurax_engine_init() == 0);
    assert(structurax_engine_is_initialized() == 1);

    char *trace = structurax_test_operation(2, 3);
    assert(trace != NULL);
    assert(strstr(trace, "\"schema_version\":\"1.0.0\"") != NULL);
    assert(strstr(trace, "\"sum\":5") != NULL);
    assert(strstr(trace, "\"event_type\":\"TEST_SUM\"") != NULL);
    structurax_free_string(trace);

    char *negative_trace = structurax_test_operation(-4, 1);
    assert(negative_trace != NULL);
    assert(strstr(negative_trace, "\"sum\":-3") != NULL);
    structurax_free_string(negative_trace);

    return 0;
}
