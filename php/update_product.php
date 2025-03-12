<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'] ?? null;
$brand = $data['brand'] ?? null;
$name = $data['name'] ?? null;
$price = $data['price'] ?? null;
$storage = $data['storage'] ?? null;
$os = $data['os'] ?? null;
$image = $data['image'] ?? null;
$inStock = $data['inStock'] ?? null;

if (!$id || !$brand || !$name || !$price || !$storage || !$os || !$image || $inStock === null) {
    echo json_encode(['error' => 'Все поля обязательны']);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE smartphones SET brand = :brand, name = :name, price = :price, storage = :storage, os = :os, image = :image, inStock = :inStock WHERE id = :id");
    $stmt->execute([
        'id' => $id,
        'brand' => $brand,
        'name' => $name,
        'price' => $price,
        'storage' => $storage,
        'os' => $os,
        'image' => $image,
        'inStock' => $inStock
    ]);

    echo json_encode(['message' => 'Товар успешно обновлен']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при обновлении товара: ' . $e->getMessage()]);
}
?>