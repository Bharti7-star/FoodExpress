
```sql
CREATE DATABASE IF NOT EXISTS food_delivery;

USE food_delivery;

CREATE TABLE IF NOT EXISTS foods (
    id BIGINT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    description VARCHAR(500),
    image VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    address VARCHAR(1000) NOT NULL,
    total INT NOT NULL,
    items_json LONGTEXT NOT NULL
);

INSERT IGNORE INTO foods
(id, name, category, price, description, image)
VALUES
(1, 'Margherita Pizza', 'Pizza', 199,
 'Classic pizza with cheese and tomato',
 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=600&q=80'),

(2, 'Cheese Burger', 'Burger', 149,
 'Delicious burger with melted cheese',
 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'),

(3, 'Veg Biryani', 'Indian', 179,
 'Aromatic rice with Indian spices',
 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'),

(4, 'French Fries', 'Burger', 99,
 'Crispy golden potato fries',
 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80'),

(5, 'Paneer Pizza', 'Pizza', 249,
 'Pizza topped with spicy paneer',
 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'),

(6, 'Cold Coffee', 'Drinks', 89,
 'Chilled and creamy coffee',
 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80'),

(7, 'Masala Dosa', 'Indian', 129,
 'Crispy dosa with potato filling',
 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80'),

(8, 'Fresh Lemonade', 'Drinks', 59,
 'Refreshing lemon drink',
 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=600&q=80');
```
