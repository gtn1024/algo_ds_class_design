// Result.java
package com.getaoning.algo_ds_class_design;

import org.springframework.http.ResponseEntity;

public record Result<T>(
        Integer code,
        String message,
        T data
) {
    public static <T> ResponseEntity<Result<T>> success(T data) {
        return ResponseEntity.ok(new Result<>(200, "success", data));
    }

    public static <T> ResponseEntity<Result<T>> success() {
        return success(null);
    }

    public static <T> ResponseEntity<Result<T>> fail(Integer code, String message) {
        return ResponseEntity.status(code).body(new Result<>(code, message, null));
    }
}
