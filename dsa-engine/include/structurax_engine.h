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

#ifdef __cplusplus
}
#endif

#endif
