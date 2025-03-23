<?php
header('Content-Type: application/json');
require 'db.php';

try {
    // Получаем статистику купленных товаров
    $stmt = $conn->query("
        SELECT p.name, SUM(o.quantity) AS total_quantity
        FROM orders o
        JOIN smartphones p ON o.product_id = p.id
        GROUP BY p.name
    ");
    $statistics = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Формируем данные для графика
    $labels = [];
    $data = [];

    foreach ($statistics as $item) {
        $labels[] = $item['name']; // Названия товаров
        $data[] = $item['total_quantity']; // Количество купленных товаров
    }

    echo json_encode([
        'labels' => $labels,
        'data' => $data
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при получении статистики: ' . $e->getMessage()]);
}
?>