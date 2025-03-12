<?php
session_start();

if (!isset($_SESSION['admin'])) {
    header('Location: admin_login.html'); // Перенаправляем на страницу входа
    exit;
}

?>