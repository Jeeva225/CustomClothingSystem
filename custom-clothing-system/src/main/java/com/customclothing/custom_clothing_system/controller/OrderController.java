package com.customclothing.custom_clothing_system.controller;

import com.customclothing.custom_clothing_system.entity.Order;
import com.customclothing.custom_clothing_system.entity.OrderStatusHistory;
import com.customclothing.custom_clothing_system.entity.User;
import com.customclothing.custom_clothing_system.repository.OrderRepository;
import com.customclothing.custom_clothing_system.repository.OrderStatusHistoryRepository;
import com.customclothing.custom_clothing_system.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderStatusHistoryRepository historyRepository;

    public OrderController(
            OrderRepository orderRepository,
            UserRepository userRepository,
            OrderStatusHistoryRepository historyRepository) {

        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {

        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("Order Placed");
        }

        Order savedOrder = orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory(
                savedOrder.getId(),
                savedOrder.getStatus()
        );

        historyRepository.save(history);

        return savedOrder;
    }

    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/history")
    public List<OrderStatusHistory> getOrderHistory(
            @PathVariable Long id) {

        return historyRepository
                .findByOrderIdOrderByChangedAtAsc(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomer(
            @PathVariable Long customerId) {

        return orderRepository.findAll()
                .stream()
                .filter(order ->
                        order.getCustomerId().equals(customerId))
                .collect(Collectors.toList());
    }

    @GetMapping("/tailor/{tailorId}")
    public List<Order> getOrdersByTailor(
            @PathVariable Long tailorId) {

        return orderRepository.findAll()
                .stream()
                .filter(order ->
                        order.getTailorId() != null &&
                        order.getTailorId().equals(tailorId))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        order.setStatus(status);

        Order savedOrder = orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory(
                savedOrder.getId(),
                savedOrder.getStatus()
        );

        historyRepository.save(history);

        return ResponseEntity.ok(savedOrder);
    }

    @PutMapping("/{id}/assign-tailor")
    public ResponseEntity<?> assignTailor(
            @PathVariable Long id,
            @RequestParam Long tailorId) {

        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        User tailor = userRepository.findById(tailorId).orElse(null);

        if (tailor == null) {
            return ResponseEntity.badRequest()
                    .body("Tailor not found");
        }

        if (!"TAILOR".equalsIgnoreCase(tailor.getRole())) {
            return ResponseEntity.badRequest()
                    .body("Selected user is not a tailor");
        }

        order.setTailorId(tailorId);

        return ResponseEntity.ok(orderRepository.save(order));
    }
}