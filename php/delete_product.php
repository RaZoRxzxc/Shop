<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(['error' => 'ID товара обязателен']);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM smartphones WHERE id = :id");
    $stmt->execute(['id' => $id]);

    echo json_encode(['message' => 'Товар успешно удален']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при удалении товара: ' . $e->getMessage()]);
}
?>