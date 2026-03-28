package com.foodorder.service;

import com.foodorder.dto.*;
import com.foodorder.entity.*;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private UserRepository userRepository;

    // ── Place a new order ─────────────────────────────────────────────────────
    @Transactional
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        // Build order items and calculate total
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest ir : request.getItems()) {
            FoodItem food = foodItemRepository.findById(ir.getFoodItemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Food item not found with id: " + ir.getFoodItemId()));

            if (!food.getAvailable()) {
                throw new IllegalArgumentException(
                        "'" + food.getName() + "' is currently unavailable");
            }

            BigDecimal subtotal = food.getPrice()
                    .multiply(BigDecimal.valueOf(ir.getQuantity()));

            OrderItem item = OrderItem.builder()
                    .foodItem(food)
                    .quantity(ir.getQuantity())
                    .unitPrice(food.getPrice())
                    .subtotal(subtotal)
                    .build();

            orderItems.add(item);
            total = total.add(subtotal);
        }

        // Build and save order
        Order order = Order.builder()
                .user(user)
                .status(Order.OrderStatus.PENDING)
                .deliveryAddress(request.getDeliveryAddress())
                .specialInstructions(request.getSpecialInstructions())
                .totalAmount(total)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        return toResponse(orderRepository.save(order));
    }

    // ── Get orders for a user ─────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Get single order ──────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        return toResponse(orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId)));
    }

    // ── Get all orders (admin) ────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Update order status (admin) ───────────────────────────────────────────
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid status: '" + status + "'. Valid values: " +
                    "PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED");
        }

        return toResponse(orderRepository.save(order));
    }

    // ── Convert entity to DTO ─────────────────────────────────────────────────
    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .foodItemId(item.getFoodItem().getId())
                        .foodItemName(item.getFoodItem().getName())
                        .foodItemImageUrl(item.getFoodItem().getImageUrl())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .userEmail(order.getUser().getEmail())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .deliveryAddress(order.getDeliveryAddress())
                .specialInstructions(order.getSpecialInstructions())
                .orderItems(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
