// StudentRepository.java
package com.getaoning.algo_ds_class_design;

import org.springframework.stereotype.Repository;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;

import static java.util.Objects.requireNonNull;

@Repository
public class StudentRepository {
    private final ConcurrentHashMap<String, Student> studentMap = new ConcurrentHashMap<>();

    public StudentRepository() {
        // import data from file to studentMap
        try {
            for (Student student : FileUtil.readFromFile()) {
                studentMap.put(student.getId(), student);
            }
        } catch (FileNotFoundException e) {
            // ignore
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Collection<Student> findAll() {
        return studentMap.values();
    }

    public Student findById(String id) {
        requireNonNull(id);
        var student = studentMap.get(id);
        if (student == null) {
            throw new IllegalStateException();
        }
        return student;
    }

    public Student save(Student student) {
        requireNonNull(student);
        if (studentMap.containsKey(student.getId())) {
            throw new ManagerException("学号已存在", 400);
        }
        studentMap.put(student.getId(), student);
        return student;
    }

    public Student update(Student student) {
        requireNonNull(student);
        if (!studentMap.containsKey(student.getId())) {
            throw new ManagerException("学号不存在", 404);
        }
        studentMap.put(student.getId(), student);
        return student;
    }

    public void delete(String id) {
        requireNonNull(id);
        if (!studentMap.containsKey(id)) {
            throw new ManagerException("学号不存在", 404);
        }
        studentMap.remove(id);
    }
}
