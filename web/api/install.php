<?php

require __DIR__ . "/lib/bootstrap.php";
require __DIR__ . "/lib/db.php";

$lock = data_dir() . "/installed.lock";

function install_fail($message)
{
    if (PHP_SAPI === "cli") {
        fwrite(STDERR, $message . "\n");
        exit(1);
    }
    http_response_code(400);
    echo $message;
    exit;
}

if (is_file($lock)) {
    install_fail("Already installed. Delete api/data/app.sqlite and api/data/installed.lock to start over.");
}

$config = load_config();
$createdNow = false;
if (!$config && PHP_SAPI === "cli") {
    install_fail("Copy api/config.example.php to api/config.local.php and fill in the database and admin password.");
}
if (!$config) {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        header("Content-Type: text/html; charset=utf-8");
        echo "<!doctype html><meta charset=utf-8><title>GGM install</title>";
        echo "<form method=post style=\"font-family:sans-serif;max-width:28rem;margin:3rem auto\">";
        echo "<h1>ติดตั้งระบบหลังบ้าน</h1>";
        echo "<p>ตั้งบัญชีแอดมินครั้งเดียว ระบบจะเก็บข้อมูลบนเซิร์ฟเวอร์นี้</p>";
        echo "<label>ชื่อ<br><input name=admin_name required style=\"width:100%;padding:.6rem\" value=\"Admin\"></label>";
        echo "<label>อีเมล<br><input name=admin_email type=email required style=\"width:100%;padding:.6rem;margin-top:.4rem\"></label>";
        echo "<label>รหัสผ่าน (อย่างน้อย 10 ตัว)<br><input name=admin_password type=password required minlength=10 style=\"width:100%;padding:.6rem;margin-top:.4rem\"></label>";
        echo "<button style=\"margin-top:1rem;padding:.6rem 1rem\">ติดตั้ง</button></form>";
        exit;
    }
    $email = isset($_POST["admin_email"]) ? trim((string) $_POST["admin_email"]) : "";
    $name = isset($_POST["admin_name"]) ? trim((string) $_POST["admin_name"]) : "";
    $password = isset($_POST["admin_password"]) ? (string) $_POST["admin_password"] : "";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($name) < 2 || strlen($password) < 10) {
        install_fail("Enter a name, a valid email, and a password of at least 10 characters.");
    }
    $config = [
        "db" => ["driver" => "sqlite"],
        "cors_origins" => [
            "https://ggmthai999.com",
            "https://www.ggmthai999.com",
            "http://ggmthai999.com",
            "http://www.ggmthai999.com",
            "http://localhost:3010",
            "http://127.0.0.1:3010",
        ],
        "admin_email" => $email,
        "admin_name" => $name,
        "admin_password" => $password,
        "setup_key" => bin2hex(random_bytes(16)),
        "notify_email" => $email,
    ];
    $written = file_put_contents(__DIR__ . "/config.local.php", "<?php\nreturn " . var_export($config, true) . ";\n");
    if ($written === false) {
        install_fail("Could not write api/config.local.php. Check that the api folder is writable.");
    }
    load_config(true);
    $createdNow = true;
    $lock = data_dir() . "/installed.lock";
}

$password = isset($config["admin_password"]) ? (string) $config["admin_password"] : "";
$email = isset($config["admin_email"]) ? (string) $config["admin_email"] : "";
$name = isset($config["admin_name"]) ? (string) $config["admin_name"] : "Admin";
$setupKey = isset($config["setup_key"]) ? (string) $config["setup_key"] : "";

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    install_fail("Set a valid admin_email in config.local.php.");
}
if (strlen($password) < 10) {
    install_fail("Set admin_password to at least 10 characters in config.local.php.");
}

if (PHP_SAPI !== "cli" && !$createdNow) {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        header("Content-Type: text/html; charset=utf-8");
        echo "<!doctype html><meta charset=utf-8><title>GGM install</title>";
        echo "<form method=post style=\"font-family:sans-serif;max-width:28rem;margin:3rem auto\">";
        echo "<h1>ติดตั้งระบบหลังบ้าน</h1>";
        echo "<p>ใส่ setup key จากไฟล์ config.local.php แล้วกดติดตั้งครั้งเดียว</p>";
        echo "<input name=setup_key type=password style=\"width:100%;padding:.6rem\" placeholder=\"setup key\">";
        echo "<button style=\"margin-top:1rem;padding:.6rem 1rem\">ติดตั้ง</button></form>";
        exit;
    }
    $given = isset($_POST["setup_key"]) ? (string) $_POST["setup_key"] : "";
    if ($setupKey === "" || !hash_equals($setupKey, $given)) {
        install_fail("Setup key does not match.");
    }
}

migrate();
$seedPath = __DIR__ . "/seed/content.json";
if (!is_file($seedPath)) {
    install_fail("Missing api/seed/content.json");
}
$payload = json_decode(file_get_contents($seedPath), true);
if (!is_array($payload) || empty($payload["destinations"]) || empty($payload["tours"])) {
    install_fail("Seed file is invalid.");
}
seed_content($payload);
if (!find_user_by_email($email)) {
    create_user_record($email, $name, $password, "admin");
}
$dir = dirname($lock);
if (!is_dir($dir)) {
    mkdir($dir, 0775, true);
}
file_put_contents($lock, gmdate("c") . "\n");

if (PHP_SAPI === "cli") {
    fwrite(STDOUT, "Installed. Admin: {$email}\n");
    exit(0);
}

header("Content-Type: text/html; charset=utf-8");
echo "<!doctype html><meta charset=utf-8><title>Installed</title>";
echo "<p style=\"font-family:sans-serif\">ติดตั้งแล้ว เข้าสู่ระบบแอดมินด้วยอีเมลที่ตั้งไว้ใน config ได้เลย</p>";
