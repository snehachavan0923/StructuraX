#include "structurax_engine.h"

#include <stdlib.h>

static int engine_initialized = 0;

const char *structurax_engine_version(void)
{
    return "0.1.0";
}

int structurax_engine_init(void)
{
    engine_initialized = 1;
    return 0;
}

int structurax_engine_is_initialized(void)
{
    return engine_initialized;
}

void structurax_free_string(char *value)
{
    free(value);
}
