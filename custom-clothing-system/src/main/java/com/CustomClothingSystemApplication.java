package com.customclothing.custom_clothing_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.customclothing.custom_clothing_system")
@EnableJpaRepositories(basePackages = "com.customclothing.custom_clothing_system")
public class CustomClothingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(CustomClothingSystemApplication.class, args);
    }
}