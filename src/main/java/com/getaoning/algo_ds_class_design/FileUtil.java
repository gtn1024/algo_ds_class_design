// FileUtil.java
package com.getaoning.algo_ds_class_design;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class FileUtil {
    public static final String FILE_NAME = "data.txt";

    public static List<Student> readFromFile() throws IOException {
        // import data from file to studentMap
        List<Student> list = new ArrayList<>();
        try (var fileReader = new FileReader(FILE_NAME);
             var bufferedReader = new BufferedReader(fileReader)
        ) {
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                String[] split = line.split(",");
                Student student = new Student();
                student.setId(split[0]);
                student.setName(split[1]);
                student.setMathScore(Integer.parseInt(split[2]));
                student.setEnglishScore(Integer.parseInt(split[3]));
                student.setPhysicsScore(Integer.parseInt(split[4]));
                student.setSum(Integer.parseInt(split[5]));
                list.add(student);
            }
        }
        return list;
    }

    public static void writeToFile(Collection<Student> data) {
        // export data from studentMap to file
        try (var fileWriter = new FileWriter(FILE_NAME)) {
            for (Student student : data) {
                fileWriter.write(student.getId() + "," + student.getName() + "," + student.getMathScore() + "," + student.getEnglishScore() + "," + student.getPhysicsScore() + "," + student.getSum() + "\n");
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
