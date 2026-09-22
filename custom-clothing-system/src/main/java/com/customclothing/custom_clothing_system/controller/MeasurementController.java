package com.customclothing.custom_clothing_system.controller;

import com.customclothing.custom_clothing_system.entity.Measurement;
import com.customclothing.custom_clothing_system.repository.MeasurementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/customer/{customerId}")
    public List<Measurement> getMeasurementsByCustomer(
            @PathVariable Long customerId) {

        return measurementRepository.findAll()
                .stream()
                .filter(measurement ->
                        measurement.getCustomerId().equals(customerId))
                .collect(Collectors.toList());
    }

    @PostMapping
    public Measurement saveMeasurement(
            @RequestBody Measurement measurement) {

        return measurementRepository.save(measurement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMeasurement(
            @PathVariable Long id,
            @RequestBody Measurement updatedMeasurement) {

        Measurement measurement =
                measurementRepository.findById(id).orElse(null);

        if (measurement == null) {
            return ResponseEntity.notFound().build();
        }

        measurement.setChest(updatedMeasurement.getChest());
        measurement.setWaist(updatedMeasurement.getWaist());
        measurement.setHips(updatedMeasurement.getHips());
        measurement.setShoulder(updatedMeasurement.getShoulder());

        Measurement savedMeasurement =
                measurementRepository.save(measurement);

        return ResponseEntity.ok(savedMeasurement);
    }
}