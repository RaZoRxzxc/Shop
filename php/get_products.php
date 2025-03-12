<?php
header('Content-Type: application/json');
require 'db.php';

// Получаем ID товара, если он передан
$productId = $_GET['id'] ?? null;

// Получаем параметры фильтрации из запроса
$brand = $_GET['brand'] ?? null;
$minPrice = $_GET['minPrice'] ?? null;
$maxPrice = $_GET['maxPrice'] ?? null;
$os = $_GET['os'] ?? null;
$storage = $_GET['storage'] ?? null;
$inStock = $_GET['inStock'] ?? null;

try {
    if ($productId) {
        // Если передан ID товара, возвращаем данные о конкретном товаре
        $stmt = $conn->prepare("SELECT * FROM smartphones WHERE id = :id");
        $stmt->execute(['id' => $productId]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            echo json_encode($product);
        } else {
            echo json_encode(['error' => 'Товар не найден']);
        }
    } else {
        // Если ID товара не передан, возвращаем список товаров с учетом фильтров
        $sql = "SELECT * FROM smartphones WHERE 1=1";

        // Добавляем условия фильтрации, если параметры переданы
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

        // Подготавливаем SQL-запрос
        $stmt = $conn->prepare($sql);

        // Привязываем параметры, если они переданы
        if ($brand) {
            $stmt->bindParam(':brand', $brand);
        }
        if ($minPrice) {
            $stmt->bindParam(':minPrice', $minPrice, PDO::PARAM_INT);
        }
        if ($maxPrice) {
            $stmt->bindParam(':maxPrice', $maxPrice, PDO::PARAM_INT);
        }
        if ($os) {
            $stmt->bindParam(':os', $os);
        }
        if ($storage) {
            $stmt->bindParam(':storage', $storage, PDO::PARAM_INT);
        }
        if ($inStock !== null) {
            $stmt->bindParam(':inStock', $inStock, PDO::PARAM_BOOL);
        }

        // Выполняем запрос
        $stmt->execute();

        // Получаем результаты
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Возвращаем данные в формате JSON
        echo json_encode($products);
    }
} catch (PDOException $e) {
    // В случае ошибки возвращаем сообщение об ошибке
    echo json_encode(['error' => 'Ошибка при получении данных: ' . $e->getMessage()]);
}
?>