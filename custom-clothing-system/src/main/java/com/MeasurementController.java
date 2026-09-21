package com.customclothing.custom_clothing_system.controller;

import com.customclothing.custom_clothing_system.model.Measurement;
import com.customclothing.custom_clothing_system.repository.MeasurementRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/measurements")
@CrossOrigin(origins = "http://localhost:5173")
public class MeasurementController {

    private final MeasurementRepository measurementRepository;

    public MeasurementController(MeasurementRepository measurementRepository) {
        this.measurementRepository = measurementRepository;
    }

    @GetMapping
    public List<Measurement> getAllMeasurements() {
        return measurementRepository.findAll();
    }

    @PostMapping
    public Measurement saveMeasurement(@RequestBody Measurement measurement) {
        return measurementRepository.save(measurement);
    }
}