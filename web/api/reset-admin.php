<?php

require __DIR__ . "/lib/bootstrap.php";
require __DIR__ . "/lib/db.php";

header("Content-Type: text/plain; charset=utf-8");

if (!load_config()) {
    http_response_code(500);
    echo "Server is not configured.\n";
    exit;
}

$lock = data_dir() . "/admin-password-reset.lock";
if (is_file($lock)) {
    echo "Already updated.\n";
    exit;
}

$email = "ggmthaimanagement@gmail.com";
$hash = '$2y$10$/ft1e.yXTs7BGWTN2PJ2deVZGkzoRBXy21kBl8/RRoBKbncYzStOW';
$pdo = db();
$current = find_user_by_email($email);
if (!$current) {
    $stmt = $pdo->query("SELECT * FROM users WHERE role = 'admin' ORDER BY id LIMIT 1");
    $current = $stmt->fetch();
}

if ($current) {
    $update = $pdo->prepare("UPDATE users SET email = ?, password_hash = ? WHERE id = ?");
    $update->execute([$email, $hash, (int) $current["id"]]);
    $pdo->prepare("DELETE FROM sessions WHERE user_id = ?")->execute([(int) $current["id"]]);
} else {
    $insert = $pdo->prepare(
        "INSERT INTO users (email, password_hash, name, role, created_at) VALUES (?, ?, ?, 'admin', ?)"
    );
    $insert->execute([$email, $hash, "Admin", now_stamp()]);
}

file_put_contents($lock, gmdate("c") . "\n");
echo "Admin email updated. Sign in at /login/.\n";
