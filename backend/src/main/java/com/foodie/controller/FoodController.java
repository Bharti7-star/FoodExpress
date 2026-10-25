
```java
package com.foodie.controller;

import com.foodie.model.CustomerOrder;
import com.foodie.model.Food;
import com.foodie.model.OrderRequest;
import com.foodie.service.FoodService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5500")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping("/foods")
    public List<Food> getFoods() {
        return foodService.getFoods();
    }

    @PostMapping("/orders")
    public ResponseEntity<?> placeOrder(
            @RequestBody OrderRequest request) {
        try {
            CustomerOrder savedOrder = foodService.placeOrder(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Order placed successfully",
                            "orderId", savedOrder.getId(),
                            "total", savedOrder.getTotal()
                    )
            );
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", exception.getMessage())
            );
        }
    }

    @GetMapping("/orders/health")
    public Map<String, String> health() {
        return Map.of("status", "Backend is running");
    }
}
```
