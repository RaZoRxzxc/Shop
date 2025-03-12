<?php
session_start(); // Начинаем сессию
header('Content-Type: application/json');
require 'db.php'; // Подключение к базе данных

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    echo json_encode(['error' => 'Все поля обязательны']);
    exit;
}

try {
    // Ищем администратора по email
    $stmt = $conn->prepare("SELECT * FROM admins WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin && $password === $admin['password']) {
        // Если пароль верный, устанавливаем сессию
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_email'] = $admin['email']; // Сохраняем email администратора в сессии
        echo json_encode(['message' => 'Авторизация успешна']);
    } else {
        echo json_encode(['error' => 'Неверный email или пароль']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при авторизации: ' . $e->getMessage()]);
}
?>