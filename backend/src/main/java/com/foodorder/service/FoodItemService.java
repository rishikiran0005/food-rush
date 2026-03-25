package com.foodorder.service;

import com.foodorder.dto.FoodItemRequest;
import com.foodorder.dto.FoodItemResponse;
import com.foodorder.entity.FoodItem;
import com.foodorder.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    // Get all available food items
    public List<FoodItemResponse> getAllAvailableItems() {
        return foodItemRepository.findByAvailableTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Get all food items (admin)
    public List<FoodItemResponse> getAllItems() {
        return foodItemRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Get by category
    public List<FoodItemResponse> getByCategory(String category) {
        return foodItemRepository.findByCategoryAndAvailableTrue(category)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Get single item
    public FoodItemResponse getById(Long id) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
        return toResponse(item);
    }

    // Create new food item (admin)
    public FoodItemResponse createItem(FoodItemRequest request) {
        FoodItem item = FoodItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .available(request.getAvailable() != null ? request.getAvailable() : true)
                .build();
        return toResponse(foodItemRepository.save(item));
    }

    // Update food item (admin)
    public FoodItemResponse updateItem(Long id, FoodItemRequest request) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        item.setImageUrl(request.getImageUrl());
        item.setAvailable(request.getAvailable());

        return toResponse(foodItemRepository.save(item));
    }

    // Toggle availability (admin)
    public FoodItemResponse toggleAvailability(Long id) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
        item.setAvailable(!item.getAvailable());
        return toResponse(foodItemRepository.save(item));
    }

    // Delete food item (admin)
    public void deleteItem(Long id) {
        if (!foodItemRepository.existsById(id)) {
            throw new RuntimeException("Food item not found with id: " + id);
        }
        foodItemRepository.deleteById(id);
    }

    // Convert entity to response DTO
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
