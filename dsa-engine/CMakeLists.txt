cmake_minimum_required(VERSION 3.16)
project(structurax_engine VERSION 0.1.0 LANGUAGES C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_EXTENSIONS OFF)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

add_library(structurax_engine SHARED
    src/common/engine.c
    src/common/trace.c
)

target_include_directories(structurax_engine PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

set_target_properties(structurax_engine PROPERTIES
    C_VISIBILITY_PRESET hidden
    VISIBILITY_INLINES_HIDDEN ON
)

if(MSVC)
    target_compile_options(structurax_engine PRIVATE /W4)
else()
    target_compile_options(structurax_engine PRIVATE -Wall -Wextra -pedantic)
endif()

enable_testing()

add_executable(engine_tests tests/test_engine.c)
target_link_libraries(engine_tests PRIVATE structurax_engine)
add_test(NAME engine_unit_tests COMMAND engine_tests)
