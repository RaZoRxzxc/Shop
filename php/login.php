<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    echo json_encode(['error' => 'Все поля обязательны']);
    exit;
}

try {
    // Ищем пользователя по email
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        echo json_encode(['error' => 'Неверный email или пароль']);
        exit;
    }

    // Возвращаем данные пользователя
    echo json_encode([
        'message' => 'Вход выполнен',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email']
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка при входе: ' . $e->getMessage()]);
}
?>