// FileAspect.java
package com.getaoning.algo_ds_class_design;

import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Aspect
@Component
public class FileAspect {
    private final StudentRepository repository;

    public FileAspect(StudentRepository repository) {
        this.repository = repository;
    }

    @After("execution(* com.getaoning.algo_ds_class_design.StudentRepository.save(..)) || execution(* com.getaoning.algo_ds_class_design.StudentRepository.update(..)) || execution(* com.getaoning.algo_ds_class_design.StudentRepository.delete(..))")
    public void after() {
        Collection<Student> list = repository.findAll();
        FileUtil.writeToFile(list);
    }
}
