<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'] ?? null;
$price = $data['price'] ?? null;
$brand = $data['brand'] ?? null;
$storage = $data['storage'] ?? null;
$os = $data['os'] ?? null;
$image = $data['image'] ?? null;
$inStock = $data['inStock'] ?? null;

if (!$name || !$price || !$brand || !$storage || !$os || !$image || !$inStock) {
    echo json_encode(['error' => 'Все поля обязательны']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO smartphones (name, price, brand, storage, os, image, inStock) VALUES (:name, :price, :brand, :storage, :os, :image, :inStock)");
    $stmt->execute([
        'name' => $name,
        'price' => $price,
        'brand' => $brand,
        'storage' => $storage,
        'os' => $os,
        'image' => $image,
        'inStock' => $inStock
    ]);

    echo json_encode(['message' => 'Товар успешно добавлен']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при добавлении товара: ' . $e->getMessage()]);
}
?>