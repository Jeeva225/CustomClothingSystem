package com.customclothing.custom_clothing_system;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/test")
    public String testApp() {
        return "Custom Clothing System is Running Successfully!";
    }
}