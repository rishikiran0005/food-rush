package com.foodorder.controller;

import com.foodorder.dto.FoodItemRequest;
import com.foodorder.dto.FoodItemResponse;
import com.foodorder.service.FoodItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    // GET /api/foods — public
    @GetMapping
    public ResponseEntity<List<FoodItemResponse>> getAvailableFoods() {
        return ResponseEntity.ok(foodItemService.getAllAvailableItems());
    }

    // GET /api/foods/all — admin
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FoodItemResponse>> getAllFoods() {
        return ResponseEntity.ok(foodItemService.getAllItems());
    }

    // GET /api/foods/{id} — public
    @GetMapping("/{id}")
    public ResponseEntity<FoodItemResponse> getFoodById(@PathVariable Long id) {
        return ResponseEntity.ok(foodItemService.getById(id));
    }

    // GET /api/foods/category/{category} — public
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodItemResponse>> getByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(foodItemService.getByCategory(category));
    }

    // POST /api/foods — admin only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FoodItemResponse> createFood(
            @Valid @RequestBody FoodItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(foodItemService.createItem(request));
    }

    // PUT /api/foods/{id} — admin only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FoodItemResponse> updateFood(
            @PathVariable Long id,
            @Valid @RequestBody FoodItemRequest request) {
        return ResponseEntity.ok(foodItemService.updateItem(id, request));
    }

    // PATCH /api/foods/{id}/toggle — admin only
    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FoodItemResponse> toggleAvailability(
            @PathVariable Long id) {
        return ResponseEntity.ok(foodItemService.toggleAvailability(id));
    }

    // DELETE /api/foods/{id} — admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        foodItemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
