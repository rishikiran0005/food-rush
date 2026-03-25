package com.foodorder.controller;

import com.foodorder.dto.FoodItemRequest;
import com.foodorder.dto.FoodItemResponse;
import com.foodorder.service.FoodItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/foods")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    // GET /api/foods - public, returns available items
    @GetMapping
    public ResponseEntity<List<FoodItemResponse>> getAvailableFoods() {
        return ResponseEntity.ok(foodItemService.getAllAvailableItems());
    }

    // GET /api/foods/{id} - public
    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(foodItemService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/foods/category/{category} - public
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodItemResponse>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(foodItemService.getByCategory(category));
    }

    // POST /api/foods - admin only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createFood(@Valid @RequestBody FoodItemRequest request) {
        try {
            FoodItemResponse response = foodItemService.createItem(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/foods/{id} - admin only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateFood(@PathVariable Long id, @Valid @RequestBody FoodItemRequest request) {
        try {
            FoodItemResponse response = foodItemService.updateItem(id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PATCH /api/foods/{id}/toggle - admin only
    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(foodItemService.toggleAvailability(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/foods/{id} - admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFood(@PathVariable Long id) {
        try {
            foodItemService.deleteItem(id);
            return ResponseEntity.ok(Map.of("message", "Food item deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
