// ExceptionHandlerController.java
package com.getaoning.algo_ds_class_design;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandlerController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExceptionHandlerController.class);

    @ExceptionHandler(ManagerException.class)
    public ResponseEntity<Result<Void>> handleManagerException(ManagerException e) {
        LOGGER.warn(e.getMessage(), e);
        return Result.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result<Void>> handleException(Exception e) {
        LOGGER.error(e.getMessage(), e);
        return Result.fail(500, e.getMessage());
    }
}
