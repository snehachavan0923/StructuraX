#ifndef STRUCTURAX_ENGINE_H
#define STRUCTURAX_ENGINE_H

#ifdef __cplusplus
extern "C" {
#endif

#if defined(_WIN32)
#define STRUCTURAX_API __declspec(dllexport)
#else
#define STRUCTURAX_API __attribute__((visibility("default")))
#endif

STRUCTURAX_API const char *structurax_engine_version(void);

STRUCTURAX_API int structurax_engine_init(void);

STRUCTURAX_API int structurax_engine_is_initialized(void);

STRUCTURAX_API char *structurax_test_operation(int left, int right);

STRUCTURAX_API void structurax_free_string(char *value);

STRUCTURAX_API char *structurax_sll_execute(
    const int *initial_values,
    int initial_count,
    int operation_type,
    int value,
    int position
);

STRUCTURAX_API char *structurax_dll_execute(
    const int *initial_values,
    int initial_count,
    int operation_type,
    int value,
    int position,
    int target_value
);

STRUCTURAX_API char *structurax_cll_execute(
    const int *initial_values,
    int initial_count,
    int operation_type,
    int value,
    int position
);

STRUCTURAX_API char *structurax_poly_execute(
    const int *coeffs1,
    const int *exps1,
    int count1,
    const int *coeffs2,
    const int *exps2,
    int count2,
    int operation_type
);

#ifdef __cplusplus
}
#endif

#endif
