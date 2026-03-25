package com.foodorder.dto;

import com.foodorder.entity.Order;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Order.OrderStatus status;
    private BigDecimal totalAmount;
    private String deliveryAddress;
    private String specialInstructions;
    private List<OrderItemResponse> orderItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
