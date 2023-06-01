// Student.java
package com.getaoning.algo_ds_class_design;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class Student {              // 学生类
    private String id;              // 学号
    private String name;            // 姓名
    private Integer mathScore;      // 数学成绩
    private Integer englishScore;   // 英语成绩
    private Integer physicsScore;   // 物理成绩
    private Integer sum;            // 总分
    private Integer rank;           // 排名
}
