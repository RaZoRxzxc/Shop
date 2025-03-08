<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$name || !$email || !$password) {
    echo json_encode(['error' => 'Все поля обязательны']);
    exit;
}

try {
    // Проверяем, существует ли пользователь с таким email
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if ($user) {
        echo json_encode(['error' => 'Пользователь с таким email уже существует']);
        exit;
    }

    // Хешируем пароль
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Добавляем нового пользователя
    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
    $stmt->execute([
        'name' => $name,
        'email' => $email,
        'password' => $hashedPassword
    ]);

    echo json_encode(['message' => 'Регистрация успешна']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при регистрации: ' . $e->getMessage()]);
}
?>