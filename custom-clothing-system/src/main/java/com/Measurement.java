package com.customclothing.custom_clothing_system;

import jakarta.persistence.*;

@Entity
@Table(name = "measurements")
public class Measurement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private double chest;
    private double waist;
    private double hips;
    private double shoulder;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public double getChest() { return chest; }
    public void setChest(double chest) { this.chest = chest; }

    public double getWaist() { return waist; }
    public void setWaist(double waist) { this.waist = waist; }

    public double getHips() { return hips; }
    public void setHips(double hips) { this.hips = hips; }

    public double getShoulder() { return shoulder; }
    public void setShoulder(double shoulder) { this.shoulder = shoulder; }
}