<?php
session_start(); // Начинаем сессию

// Удаляем данные сессии
session_unset();
session_destroy();

// Возвращаем успешный ответ
echo json_encode(['message' => 'Вы вышли из системы']);
?>