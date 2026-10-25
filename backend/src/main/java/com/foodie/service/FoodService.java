
```java
package com.foodie.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodie.model.CustomerOrder;
import com.foodie.model.Food;
import com.foodie.model.OrderRequest;
import com.foodie.repository.FoodRepository;
import com.foodie.repository.OrderRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FoodService {

    private final FoodRepository foodRepository;
    private final OrderRepository orderRepository;
    private final ObjectMapper objectMapper;

    public FoodService(
            FoodRepository foodRepository,
            OrderRepository orderRepository,
            ObjectMapper objectMapper) {
        this.foodRepository = foodRepository;
        this.orderRepository = orderRepository;
        this.objectMapper = objectMapper;
    }

    public List<Food> getFoods() {
        return foodRepository.findAll();
    }

    @Transactional
    public CustomerOrder placeOrder(OrderRequest request) {
        if (request.getCustomerName() == null
                || request.getCustomerName().isBlank()
                || request.getPhone() == null
                || !request.getPhone().matches("[0-9]{10}")
                || request.getAddress() == null
                || request.getAddress().isBlank()
                || request.getItems() == null
                || request.getItems().isEmpty()) {
            throw new IllegalArgumentException(
                    "Please provide valid customer and order details.");
        }

        int total = 0;

        for (OrderRequest.Item item : request.getItems()) {
            if (item.getFoodId() == null
                    || item.getQuantity() == null
                    || item.getQuantity() < 1
                    || item.getQuantity() > 100) {
                throw new IllegalArgumentException("Invalid food quantity.");
            }

            Food food = foodRepository.findById(item.getFoodId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Food not found."));

            total = Math.addExact(
                    total,
                    Math.multiplyExact(food.getPrice(), item.getQuantity())
            );
        }

        CustomerOrder order = new CustomerOrder();
        order.setCustomerName(request.getCustomerName().trim());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress().trim());
        order.setTotal(total);

        try {
            order.setItemsJson(objectMapper.writeValueAsString(
                    request.getItems()));
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("Could not process order items.");
        }

        return orderRepository.save(order);
    }
}
```
