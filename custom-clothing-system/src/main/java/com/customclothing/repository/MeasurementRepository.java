package com.customclothing.custom_clothing_system.repository;

import com.customclothing.custom_clothing_system.entity.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeasurementRepository extends JpaRepository<Measurement, Long> {

}