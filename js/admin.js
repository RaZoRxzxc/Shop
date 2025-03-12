document.addEventListener('DOMContentLoaded', function () {
    loadProducts(); 
});

// Функция для загрузки товаров
function loadProducts() {
    fetch('php/get_products.php')
        .then(response => response.json())
        .then(data => {
            const productsTable = document.getElementById('products-table');
            productsTable.innerHTML = '';

            if (data.error) {
                console.error(data.error);
                return;
            }

            // Создаем таблицу товаров
            const table = `
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Бренд</th>
                            <th>Память</th>
                            <th>ОС</th>
                            <th>В наличии</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(product => `
                            <tr>
                                <td>${product.id}</td>
                                <td>${product.name}</td>
                                <td>${product.price} руб.</td>
                                <td>${product.brand}</td>
                                <td>${product.storage} ГБ</td>
                                <td>${product.os}</td>
                                <td>${product.inStock ? 'Да' : 'Нет'}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm" onclick="openEditProductModal(${product.id})">Редактировать</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Удалить</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            productsTable.innerHTML = table;
        })
        .catch(error => console.error('Ошибка загрузки товаров:', error));
}

// Функция для открытия модального окна добавления товара
function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
}

// Функция для закрытия модального окна добавления товара
function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

// Функция для добавления товара
document.getElementById('addProductForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const product = {
        name: document.getElementById('productName').value,
        price: document.getElementById('productPrice').value,
        brand: document.getElementById('productBrand').value,
        storage: document.getElementById('productStorage').value,
        os: document.getElementById('productOS').value,
        image: document.getElementById('productImage').value,
        inStock: document.getElementById('productInStock').value
    };

    fetch('php/add_product.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                closeAddProductModal();
                loadProducts(); // Обновляем таблицу товаров
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error('Ошибка:', error));
});

// Функция для удаления товара
function deleteProduct(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        fetch('php/delete_product.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: productId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    loadProducts(); // Обновляем таблицу товаров
                } else {
                    alert(data.error);
                }
            })
            .catch(error => console.error('Ошибка:', error));
    }
}

// Функция для открытия модального окна редактирования товара
function openEditProductModal(productId) {
    fetch(`php/get_products.php?id=${productId}`)
        .then(response => response.json())
        .then(product => {
            if (!product) {
                alert('Товар не найден');
                return;
            }

            document.getElementById('editProductId').value = product.id;
            document.getElementById('editProductName').value = product.name;
            document.getElementById('editProductPrice').value = product.price;
            document.getElementById('editProductBrand').value = product.brand;
            document.getElementById('editProductStorage').value = product.storage;
            document.getElementById('editProductOS').value = product.os;
            document.getElementById('editProductImage').value = product.image;
            document.getElementById('editProductInStock').value = product.inStock ? '1' : '0';

            document.getElementById('editProductModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Ошибка загрузки товара:', error);
            alert('Ошибка при загрузке данных товара');
        });
}

// Функция для закрытия модального окна редактирования товара
function closeEditProductModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

document.getElementById('editProductForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const product = {
        id: document.getElementById('editProductId').value,
        brand: document.getElementById('editProductBrand').value,
        name: document.getElementById('editProductName').value,
        price: document.getElementById('editProductPrice').value,
        storage: document.getElementById('editProductStorage').value,
        os: document.getElementById('editProductOS').value,
        image: document.getElementById('editProductImage').value,
        inStock: document.getElementById('editProductInStock').value
    };

    console.log('Отправка данных:', product); // Проверка данных перед отправкой

    fetch('php/update_product.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                closeEditProductModal();
                loadProducts(); // Обновляем таблицу товаров
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error('Ошибка:', error));
});