package com.customclothing.custom_clothing_system.repository;

import com.customclothing.custom_clothing_system.entity.Design;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignRepository extends JpaRepository<Design, Long> {
}