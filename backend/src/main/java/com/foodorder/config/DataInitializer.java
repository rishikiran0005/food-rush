package com.foodorder.config;

import com.foodorder.entity.FoodItem;
import com.foodorder.entity.User;
import com.foodorder.repository.FoodItemRepository;
import com.foodorder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed admin user if not exists
        if (!userRepository.existsByEmail("admin@foodorder.com")) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@foodorder.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9999999999")
                    .address("Admin HQ")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin@foodorder.com / admin123");
        }

        // Seed food items if none exist
        if (foodItemRepository.count() == 0) {
            List<FoodItem> items = List.of(
                FoodItem.builder().name("Margherita Pizza").description("Classic tomato, mozzarella & basil")
                    .price(new BigDecimal("12.99")).category("Pizza")
                    .imageUrl("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400").available(true).build(),

                FoodItem.builder().name("Pepperoni Pizza").description("Loaded with pepperoni and cheese")
                    .price(new BigDecimal("14.99")).category("Pizza")
                    .imageUrl("https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400").available(true).build(),

                FoodItem.builder().name("BBQ Chicken Burger").description("Grilled chicken with BBQ sauce")
                    .price(new BigDecimal("9.99")).category("Burgers")
                    .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400").available(true).build(),

                FoodItem.builder().name("Classic Cheeseburger").description("Beef patty with cheddar and veggies")
                    .price(new BigDecimal("8.99")).category("Burgers")
                    .imageUrl("https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400").available(true).build(),

                FoodItem.builder().name("Chicken Caesar Salad").description("Romaine, croutons, parmesan & Caesar dressing")
                    .price(new BigDecimal("10.99")).category("Salads")
                    .imageUrl("https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400").available(true).build(),

                FoodItem.builder().name("Spaghetti Bolognese").description("Slow-cooked beef ragu on spaghetti")
                    .price(new BigDecimal("13.99")).category("Pasta")
                    .imageUrl("https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400").available(true).build(),

                FoodItem.builder().name("Chicken Tikka Masala").description("Tender chicken in creamy tomato sauce")
                    .price(new BigDecimal("15.99")).category("Indian")
                    .imageUrl("https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400").available(true).build(),

                FoodItem.builder().name("Veg Biryani").description("Aromatic basmati rice with mixed vegetables")
                    .price(new BigDecimal("11.99")).category("Indian")
                    .imageUrl("https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400").available(true).build(),

                FoodItem.builder().name("Spring Rolls").description("Crispy rolls with vegetable filling")
                    .price(new BigDecimal("6.99")).category("Starters")
                    .imageUrl("https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400").available(true).build(),

                FoodItem.builder().name("Chocolate Brownie").description("Warm brownie with vanilla ice cream")
                    .price(new BigDecimal("5.99")).category("Desserts")
                    .imageUrl("https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400").available(true).build(),

                FoodItem.builder().name("Mango Lassi").description("Refreshing yogurt-based mango drink")
                    .price(new BigDecimal("3.99")).category("Beverages")
                    .imageUrl("https://images.unsplash.com/photo-1606168094336-48f205fd7c06?w=400").available(true).build(),

                FoodItem.builder().name("French Fries").description("Golden crispy fries with seasoning")
                    .price(new BigDecimal("4.99")).category("Sides")
                    .imageUrl("https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400").available(true).build()
            );
            foodItemRepository.saveAll(items);
            System.out.println("✅ " + items.size() + " food items seeded successfully.");
        }
    }
}
