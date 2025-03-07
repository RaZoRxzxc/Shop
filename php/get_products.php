<?php
header('Content-Type: application/json');
require 'db.php';
try {
    $stmt = $conn->query("SELECT * FROM smartphones");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
} catch (PDOException $e) {

    echo json_encode(['error' => 'Ошибка при получении данных: ' . $e->getMessage()]);
}
?>