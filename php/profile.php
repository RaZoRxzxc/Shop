<?php
session_start();
include 'includes/db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM users WHERE id = $user_id";
$result = $conn->query($sql);
$user = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Профиль</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="profile-container">
        <h2>Профиль</h2>
        <p>Имя пользователя: <?php echo $user['username']; ?></p>
        <p>Email: <?php echo $user['email']; ?></p>
        <form method="POST" action="logout.php">
            <button type="submit">Выйти</button>
        </form>
    </div>
</body>
</html>