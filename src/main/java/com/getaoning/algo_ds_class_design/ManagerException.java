// ManagerException.java
package com.getaoning.algo_ds_class_design;

public class ManagerException extends RuntimeException {
    private final Integer code;

    public ManagerException(String message, Integer code) {
        super(message);
        this.code = code;
    }

    public Integer getCode() {
        return code;
    }
}
