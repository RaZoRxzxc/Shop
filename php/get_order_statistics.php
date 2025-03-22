<?php
header('Content-Type: application/json');
require 'db.php'; // Подключение к базе данных

try {
    // Получаем статистику купленных товаров
    $stmt = $conn->query("
        SELECT p.name, SUM(o.quantity) AS total_quantity
        FROM orders o
        JOIN smartphones p ON o.product_id = p.id
        GROUP BY p.name
    ");
    $statistics = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($statistics);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при получении статистики: ' . $e->getMessage()]);
}
?>