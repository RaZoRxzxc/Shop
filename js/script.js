document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    loadCart();
    setupFilters();
    setupSearch();
    setupRegistration();
});


function loadProducts() {
    console.log("Загрузка товаров...");

    fetch('php/get_products.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            console.log("Данные получены:", data);
            const productsContainer = document.getElementById('products');
            if (!productsContainer) {
                console.error("Элемент #products не найден!");
                return;
            }
            productsContainer.innerHTML = '';

            if (data.error) {
                console.error(data.error);
                return;
            }

            data.forEach(product => {
                const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">Цена: ${product.price} руб.</p>
                                <p class="card-text">Память: ${product.storage} ГБ</p>
                                <p class="card-text">ОС: ${product.os}</p>
                                <p class="card-text">${product.inStock ? 'В наличии' : 'Нет в наличии'}</p>
                                <div class="form-group">
                                    <label>Количество:</label>
                                    <input type="number" class="form-control quantity" id="quantity-${product.id}" min="1" value="1">
                                </div>
                                <button class="btn btn-success btn-block" onclick="addToCart(${product.id})">Купить</button>
                            </div>
                        </div>
                    </div>
                `;
                productsContainer.innerHTML += card;
            });
        })
        .catch(error => console.error('Ошибка загрузки товаров:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
});

function addToCart(productId) {
    const quantity = document.getElementById(`quantity-${productId}`).value;
    const product = productsData.find(p => p.id === productId);

    if (!product) {
        alert('Товар не найден');
        return;
    }

    if (!product.inStock) {
        alert('Товара нет в наличии');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += parseInt(quantity);
    } else {
        cart.push({ id: productId, name: product.name, price: product.price, quantity: parseInt(quantity) });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Товар "${product.name}" добавлен в корзину`);
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const cartItem = `
                <div class="cart-item">
                    <p>Товар: ${item.name}</p>
                    <p>Цена: ${item.price} руб.</p>
                    <p>Количество: ${item.quantity}</p>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Удалить</button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItem;
        });
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function checkout() {
    localStorage.removeItem('cart');
    alert('Заказ оформлен!');
    loadCart();
}

function setupFilters() {
    const filters = document.querySelectorAll('.form-control');
    filters.forEach(filter => {
        filter.addEventListener('change', loadProducts);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', loadProducts);
}

function setupRegistration() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            localStorage.setItem('user', JSON.stringify({ name, email, password }));
            alert('Регистрация успешна!');
            window.location.href = 'profile.html';
        });
    }

    const profileInfo = document.getElementById('profile-info');
    if (profileInfo) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            profileInfo.innerHTML = `
                <p>Имя: ${user.name}</p>
                <p>Email: ${user.email}</p>
            `;
        } else {
            profileInfo.innerHTML = '<p>Пользователь не найден</p>';
        }
    }
}

//Registration
function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('php/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            if (data.includes("успешно")) {
                window.location.href = 'profile.html';
            }
        })
        .catch(error => console.error('Ошибка регистрации:', error));
}

//Login
function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('php/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            if (data.includes("Вход выполнен")) {
                window.location.href = 'profile.html';
            }
        })
        .catch(error => console.error('Ошибка входа:', error));
}