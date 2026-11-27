from cffi import FFI

ffi = FFI()

ffi.cdef(
    """
    const char *structurax_engine_version(void);
    int structurax_engine_init(void);
    int structurax_engine_is_initialized(void);
    char *structurax_test_operation(int left, int right);
    void structurax_free_string(char *value);
    char *structurax_sll_execute(
        const int *initial_values,
        int initial_count,
        int operation_type,
        int value,
        int position
    );
    char *structurax_dll_execute(
        const int *initial_values,
        int initial_count,
        int operation_type,
        int value,
        int position,
        int target_value
    );
    char *structurax_cll_execute(
        const int *initial_values,
        int initial_count,
        int operation_type,
        int value,
        int position
    );
    char *structurax_poly_execute(
        const int *coeffs1,
        const int *exps1,
        int count1,
        const int *coeffs2,
        const int *exps2,
        int count2,
        int operation_type
    );
    """
)


def get_ffi() -> FFI:
    return ffi
