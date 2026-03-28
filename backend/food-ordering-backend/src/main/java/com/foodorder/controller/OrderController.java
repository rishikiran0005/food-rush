package com.foodorder.controller;

import com.foodorder.dto.OrderResponse;
import com.foodorder.dto.PlaceOrderRequest;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.UserRepository;
import com.foodorder.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    // ── Get current user's ID from JWT ────────────────────────────────────────
    private Long resolveUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found"))
                .getId();
    }

    // POST /api/orders — place order (authenticated users)
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(resolveUserId(auth), request));
    }

    // GET /api/orders/my — get logged-in user's orders
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getUserOrders(resolveUserId(auth)));
    }

    // GET /api/orders/{id} — get single order
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // GET /api/orders/admin/all — admin gets all orders
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // PATCH /api/orders/{id}/status — admin updates order status
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("'status' field is required");
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
