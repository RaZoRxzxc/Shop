<?php
session_start();
?>

<header>
    <div class="header-container">
        <h1>Магазин смартфонов</h1>
        <nav>
            <?php if (isset($_SESSION['user_id'])): ?>
                <a href="profile.php">Профиль</a>
                <a href="logout.php">Выйти</a>
            <?php else: ?>
                <a href="login.php">Войти</a>
                <a href="register.php">Регистрация</a>
            <?php endif; ?>
            <a href="cart.php">Корзина</a>
        </nav>
    </div>
</header>