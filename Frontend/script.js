
```javascript
const foods = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 199,
        description: "Classic pizza with cheese and tomato",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Cheese Burger",
        category: "Burger",
        price: 149,
        description: "Delicious burger with melted cheese",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Veg Biryani",
        category: "Indian",
        price: 179,
        description: "Aromatic rice with Indian spices",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "French Fries",
        category: "Burger",
        price: 99,
        description: "Crispy golden potato fries",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Paneer Pizza",
        category: "Pizza",
        price: 249,
        description: "Pizza topped with spicy paneer",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Cold Coffee",
        category: "Drinks",
        price: 89,
        description: "Chilled and creamy coffee",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Masala Dosa",
        category: "Indian",
        price: 129,
        description: "Crispy dosa with potato filling",
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Fresh Lemonade",
        category: "Drinks",
        price: 59,
        description: "Refreshing lemon drink",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=600&q=80"
    }
];

let cart = [];

const foodGrid = document.getElementById("food-grid");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalElement = document.getElementById("total");
const message = document.getElementById("message");

function renderFoods(category = "All") {
    const filteredFoods = category === "All"
        ? foods
        : foods.filter(food => food.category === category);

    foodGrid.innerHTML = filteredFoods.map(food => `
        <article class="food-card">
            <img src="${food.image}" alt="${food.name}" loading="lazy">

            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>

                <div class="food-bottom">
                    <span class="price">₹${food.price}</span>
                    <button class="add-btn" data-add="${food.id}">
                        + Add
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

document.querySelector(".categories").addEventListener("click", event => {
    const button = event.target.closest("button[data-category]");

    if (!button) return;

    document.querySelectorAll(".categories button").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
    renderFoods(button.dataset.category);
});

foodGrid.addEventListener("click", event => {
    const button = event.target.closest("button[data-add]");

    if (button) {
        addToCart(Number(button.dataset.add));
    }
});

function addToCart(id) {
    const food = foods.find(item => item.id === id);
    if (!food) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...food, quantity: 1 });
    }

    message.textContent = "";
    renderCart();
}

function changeQuantity(id, amount) {
    const item = cart.find(food => food.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(food => food.id !== id);
    }

    renderCart();
}

function renderCart() {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = count;
    totalElement.textContent = total;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <p>₹${item.price} × ${item.quantity}</p>
            </div>

            <div class="quantity">
                <button type="button"
                    data-id="${item.id}" data-change="-1">−</button>

                <span>${item.quantity}</span>

                <button type="button"
                    data-id="${item.id}" data-change="1">+</button>
            </div>
        </div>
    `).join("");
}

cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-change]");

    if (!button) return;

    changeQuantity(
        Number(button.dataset.id),
        Number(button.dataset.change)
    );
});

document.getElementById("order-form").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        message.textContent = "Please add food to your cart first.";
        message.style.color = "#c62828";
        return;
    }

    const order = {
        customerName: document.getElementById("customer-name").value.trim(),
        phone: document.getElementById("customer-phone").value.trim(),
        address: document.getElementById("customer-address").value.trim(),
        items: cart.map(item => ({
            foodId: item.id,
            quantity: item.quantity
        }))
    };

    // Abhi demo hai. Java backend banne ke baad API se connect karenge.
    console.log("Order details:", order);

    message.style.color = "#16803c";
    message.textContent =
        "Order details ready! Backend connect hone par order save hoga.";
});

renderFoods();
renderCart();
```
