// ApiController.java
package com.getaoning.algo_ds_class_design;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;

import static java.util.Objects.requireNonNull;

@RestController
@RequestMapping("/")
public class ApiController {
    private final StudentRepository repository;

    public ApiController(StudentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<Result<Collection<Student>>> index(String type, Boolean failed) {
        List<Student> list = getRank(repository.findAll());
        if (failed) {
            list = switch (type) {
                case "math" -> list.stream().filter(item -> item.getMathScore() < 60).toList();
                case "english" -> list.stream().filter(item -> item.getEnglishScore() < 60).toList();
                case "physics" -> list.stream().filter(item -> item.getPhysicsScore() < 60).toList();
                default -> list;
            };
        }

        List<Student> filtered = switch (type) {
            case "math" -> list.stream().sorted(Comparator.comparingInt(Student::getMathScore).reversed()).toList();
            case "english" -> list.stream().sorted(Comparator.comparingInt(Student::getEnglishScore).reversed()).toList();
            case "physics" -> list.stream().sorted(Comparator.comparingInt(Student::getPhysicsScore).reversed()).toList();
            default -> list.stream().sorted(Comparator.comparingInt(Student::getSum).reversed()).toList();
        };
        return Result.success(filtered);
    }

    @GetMapping("{id}")
    public ResponseEntity<Result<Student>> show(@PathVariable String id) {
        return Result.success(repository.findById(id));
    }

    @PostMapping
    public ResponseEntity<Result<Student>> create(@RequestBody Student student) {
        requireNonNull(student);
        student.setSum(student.getMathScore() + student.getEnglishScore() + student.getPhysicsScore());
        return Result.success(repository.save(student));
    }

    @PatchMapping("{id}")
    public ResponseEntity<Result<Student>> update(@PathVariable String id, @RequestBody Student student) {
        requireNonNull(student);
        if (!id.equals(student.getId())) {
            throw new ManagerException("学号不匹配", 400);
        }
        student.setSum(student.getMathScore() + student.getEnglishScore() + student.getPhysicsScore());
        return Result.success(repository.update(student));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Result<Void>> delete(@PathVariable String id) {
        repository.delete(id);
        return Result.success();
    }

    @GetMapping("download")
    public ResponseEntity<Resource> download() {
        String[] headers = {"学号", "姓名", "数学成绩", "英语成绩", "物理成绩", "总成绩", "平均分", "排名"};
        var list = getRank(repository.findAll()).stream().map(item -> new String[]{
                item.getId(),
                item.getName(),
                item.getMathScore().toString(),
                item.getEnglishScore().toString(),
                item.getPhysicsScore().toString(),
                item.getSum().toString(),
                String.format("%.2f", item.getSum() / 3.0),
                item.getRank().toString()
        }).toList();
        var file = new InputStreamResource(ExcelUtil.createExcel("成绩表", headers, list));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" +
                                ZonedDateTime.now(ZoneId.of("Asia/Shanghai")).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) + ".xlsx")
                .contentType(MediaType.parseMediaType(ExcelUtil.TYPE)).body(file);
    }

    private List<Student> getRank(Collection<Student> collection) {
        List<Student> list = new ArrayList<>(collection.stream().toList());
        for (int i = 0; i < list.size() - 1; i++) {
            for (int j = 0; j < list.size() - i - 1; j++) {
                Student temp;
                if (list.get(j).getSum() < list.get(j + 1).getSum()) {
                    temp = list.get(j);
                    list.set(j, list.get(j + 1));
                    list.set(j + 1, temp);
                }
            }
        }

        for (int i = 0; i < list.size(); ++i) {
            list.get(i).setRank(i + 1);
            if (i > 0 && list.get(i - 1).getSum().equals(list.get(i).getSum())) {
                list.get(i).setRank(list.get(i - 1).getRank());
            }
        }
        return list;
    }
}
