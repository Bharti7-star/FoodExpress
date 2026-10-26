

const foodGrid = document.getElementById("food-grid");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalElement = document.getElementById("total");
const orderForm = document.getElementById("order-form");
const message = document.getElementById("message");

let foods = [];
let cart = [];

async function loadFoods() {
    try {
        const response = await fetch("/api/foods");

        if (!response.ok) {
            throw new Error("Menu load nahi hua.");
        }

        foods = await response.json();
        renderFoods();
    } catch (error) {
        console.error(error);
        foodGrid.innerHTML =
            "<p>Menu load nahi hua. Backend check karein.</p>";
    }
}

function renderFoods() {
    if (!foods.length) {
        foodGrid.innerHTML = "<p>Abhi menu mein food available nahi hai.</p>";
        return;
    }

    foodGrid.innerHTML = foods.map(food => `
        <div class="food-card">
            <img
                src="${escapeHTML(food.imageUrl || "")}"
                alt="${escapeHTML(food.name)}"
                onerror="this.style.display='none'"
            >
            <h3>${escapeHTML(food.name)}</h3>
            <p>${escapeHTML(food.description || "")}</p>
            <p>Category: ${escapeHTML(food.category || "Other")}</p>
            <p><strong>₹${Number(food.price).toFixed(2)}</strong></p>
            <button type="button" onclick="addToCart(${Number(food.id)})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function addToCart(foodId) {
    const food = foods.find(item => Number(item.id) === Number(foodId));

    if (!food) {
        return;
    }

    const existing = cart.find(item => Number(item.id) === Number(foodId));

    if (existing) {
        if (existing.quantity >= 100) {
            alert("Maximum quantity 100 hai.");
            return;
        }
        existing.quantity++;
    } else {
        cart.push({
            id: Number(food.id),
            name: food.name,
            price: Number(food.price),
            quantity: 1
        });
    }

    renderCart();
}

function changeQuantity(foodId, change) {
    const item = cart.find(item => item.id === Number(foodId));

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== Number(foodId));
    } else if (item.quantity > 100) {
        item.quantity = 100;
    }

    renderCart();
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${escapeHTML(item.name)}</span>
                <span>
                    <button type="button"
                        onclick="changeQuantity(${item.id}, -1)">−</button>
                    ${item.quantity}
                    <button type="button"
                        onclick="changeQuantity(${item.id}, 1)">+</button>
                </span>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join("");
    }

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = count;
    totalElement.textContent = total.toFixed(2);
}

orderForm.addEventListener("submit", async event => {
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

    if (!/^\d{10}$/.test(order.phone)) {
        message.textContent = "10-digit phone number enter karein.";
        message.style.color = "#c62828";
        return;
    }

    message.textContent = "Order place ho raha hai...";
    message.style.color = "#333";

    try {
        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.message || result.error || `HTTP ${response.status}`
            );
        }

        message.style.color = "green";
        message.textContent =
            "Order successfully placed! Order ID: " +
            (result.orderId ?? result.id ?? "saved") +
            " | Total: ₹" + (result.total ?? "");

        cart = [];
        renderCart();
        orderForm.reset();
    } catch (error) {
        console.error("Order error:", error);
        message.style.color = "red";
        message.textContent = "Order save nahi hua: " + error.message;
    }
});

loadFoods();
renderCart();
