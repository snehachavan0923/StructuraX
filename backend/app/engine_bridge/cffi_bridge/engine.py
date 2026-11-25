from cffi import FFI

ffi = FFI()

ffi.cdef(
    """
    const char *structurax_engine_version(void);
    int structurax_engine_init(void);
    int structurax_engine_is_initialized(void);
    char *structurax_test_operation(int left, int right);
    void structurax_free_string(char *value);
    """
)


def get_ffi() -> FFI:
    return ffi
