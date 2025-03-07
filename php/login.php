<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Поиск пользователя по email и паролю
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email AND password = :password");
    $stmt->execute([
        'email' => $email,
        'password' => $password
    ]);
    $user = $stmt->fetch();

    if ($user) {
        echo "Вход выполнен!";
        // Сохранение данных пользователя в сессии
        session_start();
        $_SESSION['user'] = $user;
    } else {
        echo "Неверный email или пароль!";
    }
}
?>