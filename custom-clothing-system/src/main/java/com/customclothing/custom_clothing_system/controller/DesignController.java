package com.customclothing.custom_clothing_system.controller;

import com.customclothing.custom_clothing_system.entity.Design;
import com.customclothing.custom_clothing_system.repository.DesignRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designs")
@CrossOrigin(origins = "http://localhost:5173")
public class DesignController {

    private final DesignRepository designRepository;

    public DesignController(DesignRepository designRepository) {
        this.designRepository = designRepository;
    }

    @GetMapping
    public List<Design> getAllDesigns() {
        return designRepository.findAll();
    }

    @PostMapping
    public Design addDesign(@RequestBody Design design) {
        return designRepository.save(design);
    }

    @DeleteMapping("/{id}")
    public void deleteDesign(@PathVariable Long id) {
        designRepository.deleteById(id);
    }
}