<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Проверка, существует ли пользователь с таким email
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if ($user) {
        echo "Пользователь с таким email уже существует!";
    } else {
        // Добавление нового пользователя
        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
        $stmt->execute([
            'name' => $name,
            'email' => $email,
            'password' => $password
        ]);
        echo "Пользователь успешно зарегистрирован!";
    }
}
?>