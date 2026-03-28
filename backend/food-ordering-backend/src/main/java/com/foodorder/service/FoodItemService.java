package com.foodorder.service;

import com.foodorder.dto.FoodItemRequest;
import com.foodorder.dto.FoodItemResponse;
import com.foodorder.entity.FoodItem;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    // ── Get all available items (public) ──────────────────────────────────────
    @Transactional(readOnly = true)
    public List<FoodItemResponse> getAllAvailableItems() {
        return foodItemRepository.findByAvailableTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Get all items (admin) ─────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<FoodItemResponse> getAllItems() {
        return foodItemRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Get by category ───────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<FoodItemResponse> getByCategory(String category) {
        return foodItemRepository.findByCategoryAndAvailableTrue(category)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Get by ID ─────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public FoodItemResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    // ── Create new food item ──────────────────────────────────────────────────
    @Transactional
    public FoodItemResponse createItem(FoodItemRequest request) {
        FoodItem item = FoodItem.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory().trim())
                .imageUrl(request.getImageUrl())
                .available(request.getAvailable() != null ? request.getAvailable() : true)
                .build();
        return toResponse(foodItemRepository.save(item));
    }

    // ── Update food item ──────────────────────────────────────────────────────
    @Transactional
    public FoodItemResponse updateItem(Long id, FoodItemRequest request) {
        FoodItem item = findOrThrow(id);
        item.setName(request.getName().trim());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory().trim());
        item.setImageUrl(request.getImageUrl());
        item.setAvailable(request.getAvailable());
        return toResponse(foodItemRepository.save(item));
    }

    // ── Toggle availability ───────────────────────────────────────────────────
    @Transactional
    public FoodItemResponse toggleAvailability(Long id) {
        FoodItem item = findOrThrow(id);
        item.setAvailable(!item.getAvailable());
        return toResponse(foodItemRepository.save(item));
    }

    // ── Delete food item ──────────────────────────────────────────────────────
    @Transactional
    public void deleteItem(Long id) {
        if (!foodItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("FoodItem", id);
        }
        foodItemRepository.deleteById(id);
    }

    // ── Find or throw ─────────────────────────────────────────────────────────
    private FoodItem findOrThrow(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoodItem", id));
    }

    // ── Convert entity to response DTO ────────────────────────────────────────
    private FoodItemResponse toResponse(FoodItem item) {
        return FoodItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory())
                .imageUrl(item.getImageUrl())
                .available(item.getAvailable())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
