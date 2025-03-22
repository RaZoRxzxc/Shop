document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    loadCart();
    setupFilters();
    setupSearch();
    updateAuthButtons();
});


function loadProducts(filters = {}) {
    console.log("Загрузка товаров...");

    const params = new URLSearchParams(filters);

    // Запрос к серверу с параметрами фильтрации
    fetch(`php/get_products.php?${params}`)
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

            productsData = data;

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

function applyFilters() {
    const filters = {
        brand: document.getElementById('brand').value,
        minPrice: document.getElementById('minPrice').value,
        maxPrice: document.getElementById('maxPrice').value,
        os: document.getElementById('os').value,
        storage: document.getElementById('storage').value,
        inStock: document.getElementById('inStock').value
    };

    for (const key in filters) {
        if (filters[key] === "") {
            delete filters[key];
        }
    }

    loadProducts(filters);
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
        cart.push({
            id: productId,
            image: product.image,
            name: product.name,
            price: product.price,
            quantity: parseInt(quantity)
        });
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
                <div class="cart-item mb-3 p-3 border rounded">
                    <div class="row">
                        <div class="col-md-3">
                            <img src="${item.image}" class="img-fluid" alt="${item.name}">
                        </div>
                        <div class="col-md-9">
                            <h5>${item.name}</h5>
                            <p>Цена: ${item.price} руб.</p>
                            <p>Количество: ${item.quantity}</p>
                            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Удалить</button>
                        </div>
                    </div>
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
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        alert('Корзина пуста');
        return;
    }

    fetch('php/checkout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cartItems })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                localStorage.removeItem('cart'); // Очищаем корзину
                window.location.href = 'index.html'; // Перенаправляем на главную страницу
            } else {
                alert(data.error);
            }
        })
}

function setupFilters() {
    const filters = document.querySelectorAll('.form-control');
    filters.forEach(filter => {
        filter.addEventListener('change', loadProducts);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value.toLowerCase();
            loadProducts({ search: searchTerm });
        });
    } else {
        console.error('Элемент #search не найден!');
    }
}

function updateAuthButtons() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Пользователь вошёл в аккаунт
        document.getElementById('auth-buttons').style.display = 'none'; // Скрываем кнопки логина и регистрации
        document.getElementById('profile-button').style.display = 'block'; // Показываем кнопку профиля
    } else {
        // Пользователь не вошёл в аккаунт
        document.getElementById('auth-buttons').style.display = 'block'; // Показываем кнопки логина и регистрации
        document.getElementById('profile-button').style.display = 'none'; // Скрываем кнопку профиля
    }
}

// Логин
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('php/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                localStorage.setItem('user', JSON.stringify(data.user));
                updateAuthButtons(); // Обновляем кнопки после успешного входа
                window.location.href = 'index.html'; // Перенаправляем на главную страницу
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error('Ошибка:', error));
});

// Регистрация
document.getElementById('registerForm')?.addEventListener('submit', function (e) {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch('php/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Регистрация успешна!');
                window.location.href = 'login.html'; // Перенаправляем на страницу логина
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error('Ошибка:', error));
});

// Выход
function logout() {
    fetch('php/logout.php')
        .then(() => {
            localStorage.removeItem('user');
            updateAuthButtons(); // Обновляем кнопки после выхода
            window.location.href = 'index.html'; // Перенаправляем на главную страницу
        })
        .catch(error => console.error('Ошибка:', error));
}