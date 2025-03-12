<?php
session_start(); // Начинаем сессию
header('Content-Type: application/json');

// Проверяем, авторизован ли администратор
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['error' => 'Не авторизован']);
    exit;
}

// Если авторизован, возвращаем успешный ответ
echo json_encode(['message' => 'Авторизован']);
?>