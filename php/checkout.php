<?php
session_start(); // Начинаем сессию
header('Content-Type: application/json');
require 'db.php'; // Подключение к базе данных

// Получаем данные о заказе из запроса
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['cart'])) {
    echo json_encode(['error' => 'Корзина пуста']);
    exit;
}

try {
    // Добавляем каждый товар из корзины в таблицу orders
    foreach ($data['cart'] as $item) {
        $productId = $item['id'];
        $quantity = $item['quantity'];

        // Вставляем данные в таблицу orders
        $stmt = $conn->prepare("INSERT INTO orders (product_id, quantity) VALUES (:product_id, :quantity)");
        $stmt->execute([
            'product_id' => $productId,
            'quantity' => $quantity
        ]);
    }

    echo json_encode(['message' => 'Заказ успешно оформлен']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при оформлении заказа: ' . $e->getMessage()]);
}
?>