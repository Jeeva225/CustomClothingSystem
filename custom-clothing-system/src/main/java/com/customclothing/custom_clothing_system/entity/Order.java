package com.customclothing.custom_clothing_system.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "clothing_orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private Long tailorId;

    private String designName;
    private String status;

    private LocalDate orderDate;
    private LocalDate deliveryDate;

    public Order() {
    }

    @PrePersist
    public void setOrderDates() {
        if (orderDate == null) {
            orderDate = LocalDate.now();
        }

        if (deliveryDate == null) {
            deliveryDate = orderDate.plusDays(7);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getTailorId() {
        return tailorId;
    }

    public void setTailorId(Long tailorId) {
        this.tailorId = tailorId;
    }

    public String getDesignName() {
        return designName;
    }

    public void setDesignName(String designName) {
        this.designName = designName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }
}