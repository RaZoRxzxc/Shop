<?php
header('Content-Type: application/json');
require 'db.php';

$brand = $_GET['brand'] ?? null;
$minPrice = $_GET['minPrice'] ?? null;
$maxPrice = $_GET['maxPrice'] ?? null;
$os = $_GET['os'] ?? null;
$storage = $_GET['storage'] ?? null;
$inStock = $_GET['inStock'] ?? null;

try {
    $sql = "SELECT * FROM smartphones WHERE 1=1";

    if ($brand) {
        $sql .= " AND brand = :brand";
    }
    if ($minPrice) {
        $sql .= " AND price >= :minPrice";
    }
    if ($maxPrice) {
        $sql .= " AND price <= :maxPrice";
    }
    if ($os) {
        $sql .= " AND os = :os";
    }
    if ($storage) {
        $sql .= " AND storage = :storage";
    }
    if ($inStock !== null) {
        $sql .= " AND inStock = :inStock";
    }

    $stmt = $conn->prepare($sql);

    if ($brand) {
        $stmt->bindParam(':brand', $brand);
    }
    if ($minPrice) {
        $stmt->bindParam(':minPrice', $minPrice);
    }
    if ($maxPrice) {
        $stmt->bindParam(':maxPrice', $maxPrice);
    }
    if ($os) {
        $stmt->bindParam(':os', $os);
    }
    if ($storage) {
        $stmt->bindParam(':storage', $storage);
    }
    if ($inStock !== null) {
        $stmt->bindParam(':inStock', $inStock, PDO::PARAM_BOOL);
    }

    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
} 
catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при получении данных: ' . $e->getMessage()]);
}
?>