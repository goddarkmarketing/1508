<?php

require __DIR__ . "/lib/bootstrap.php";
require __DIR__ . "/lib/db.php";
require __DIR__ . "/lib/backup.php";

if (!load_config()) {
    json_out(["error" => "Missing api/config.local.php"], 500);
}

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    send_cors();
    http_response_code(204);
    exit;
}

$uri = parse_url(isset($_SERVER["REQUEST_URI"]) ? $_SERVER["REQUEST_URI"] : "/", PHP_URL_PATH);
$path = rawurldecode($uri ? $uri : "/");
$path = preg_replace("#/index\.php$#", "", $path);
if (strpos($path, "/web/api/") === 0) {
    $path = substr($path, strlen("/web/api"));
} elseif ($path === "/web/api") {
    $path = "/";
}
if (strpos($path, "/api/") === 0) {
    $path = substr($path, 4);
} elseif ($path === "/api") {
    $path = "/";
}
$segments = array_values(array_filter(explode("/", trim($path, "/")), "strlen"));
$method = $_SERVER["REQUEST_METHOD"];
$a = isset($segments[0]) ? $segments[0] : "";
$b = isset($segments[1]) ? $segments[1] : "";
$c = isset($segments[2]) ? $segments[2] : "";

if ($method === "GET" && $a === "health") {
    db();
    json_out(["ok" => true]);
}

if ($a === "auth" && $b === "login" && $method === "POST") {
    $body = body_json();
    $email = isset($body["email"]) ? $body["email"] : "";
    $password = isset($body["password"]) ? (string) $body["password"] : "";
    $user = find_user_by_email($email);
    if (!$user || !password_verify($password, $user["password_hash"])) {
        fail("Email or password is incorrect", 401);
    }
    $token = create_session($user["id"]);
    json_out(["token" => $token, "user" => public_user($user)]);
}

if ($a === "auth" && $b === "logout" && $method === "POST") {
    $token = bearer_token();
    if ($token !== "") {
        delete_session($token);
    }
    json_out(["ok" => true]);
}

if ($a === "auth" && $b === "me" && $method === "GET") {
    json_out(["user" => require_user()]);
}

if ($a === "auth" && $b === "password" && $method === "PATCH") {
    $user = require_user();
    $body = body_json();
    $current = isset($body["current"]) ? (string) $body["current"] : "";
    $next = isset($body["next"]) ? (string) $body["next"] : "";
    $row = find_user_by_id($user["id"]);
    if (!$row || !password_verify($current, $row["password_hash"])) {
        fail("Current password is incorrect", 400);
    }
    if (strlen($next) < 10) {
        fail("Password must be at least 10 characters");
    }
    update_user_record($user["id"], ["password" => $next]);
    json_out(["ok" => true]);
}

if ($a === "content" && $b === "public" && $method === "GET") {
    json_out(public_content());
}

if ($a === "content" && $b === "catalog" && $method === "GET") {
    json_out(catalog_content());
}

if ($a === "stats" && $method === "GET") {
    require_user();
    json_out(admin_stats());
}

if ($a === "users" && $b === "" && $method === "GET") {
    require_user(["admin"]);
    json_out(["users" => list_users()]);
}

if ($a === "users" && $b === "" && $method === "POST") {
    require_user(["admin"]);
    $body = body_json();
    $email = isset($body["email"]) ? trim((string) $body["email"]) : "";
    $name = isset($body["name"]) ? trim((string) $body["name"]) : "";
    $password = isset($body["password"]) ? (string) $body["password"] : "";
    $role = isset($body["role"]) ? $body["role"] : "viewer";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail("Enter a valid email");
    }
    if ($name === "") {
        fail("Name is required");
    }
    if (strlen($password) < 10) {
        fail("Password must be at least 10 characters");
    }
    if (!in_array($role, ["admin", "sales", "viewer"], true)) {
        fail("Invalid role");
    }
    if (find_user_by_email($email)) {
        fail("That email is already used", 409);
    }
    $id = create_user_record($email, $name, $password, $role);
    json_out(["user" => public_user(find_user_by_id($id))], 201);
}

if ($a === "users" && $b !== "" && $method === "PATCH") {
    require_user(["admin"]);
    json_out(["user" => update_user_record((int) $b, body_json())]);
}

if ($a === "users" && $b !== "" && $method === "DELETE") {
    $user = require_user(["admin"]);
    if ((int) $b === (int) $user["id"]) {
        fail("You cannot delete your own account");
    }
    delete_user_record((int) $b);
    json_out(["ok" => true]);
}

if ($a === "destinations" && $b === "" && $method === "GET") {
    require_user();
    json_out(["destinations" => list_destinations()]);
}

if ($a === "destinations" && $b === "" && $method === "POST") {
    require_user(["admin"]);
    json_out(["destination" => save_destination(body_json())], 201);
}

if ($a === "destinations" && $b !== "" && $method === "PUT") {
    require_user(["admin"]);
    json_out(["destination" => save_destination(body_json(), $b)]);
}

if ($a === "destinations" && $b !== "" && $method === "DELETE") {
    require_user(["admin"]);
    delete_destination($b);
    json_out(["ok" => true]);
}

if ($a === "tours" && $b === "" && $method === "GET") {
    require_user();
    json_out(["tours" => list_tours(false)]);
}

if ($a === "tours" && $b === "" && $method === "POST") {
    require_user(["admin"]);
    json_out(["tour" => save_tour(body_json())], 201);
}

if ($a === "tours" && $b !== "" && $method === "PUT") {
    require_user(["admin"]);
    json_out(["tour" => save_tour(body_json(), $b)]);
}

if ($a === "tours" && $b !== "" && $method === "DELETE") {
    require_user(["admin"]);
    delete_tour($b);
    json_out(["ok" => true]);
}

if ($a === "videos" && $b === "" && $method === "GET") {
    require_user();
    json_out(["videos" => list_videos()]);
}

if ($a === "videos" && $b === "" && $method === "POST") {
    require_user(["admin"]);
    json_out(["video" => save_video(body_json())], 201);
}

if ($a === "videos" && $b !== "" && $method === "PUT") {
    require_user(["admin"]);
    json_out(["video" => save_video(body_json(), (int) $b)]);
}

if ($a === "videos" && $b !== "" && $method === "DELETE") {
    require_user(["admin"]);
    delete_video((int) $b);
    json_out(["ok" => true]);
}

if ($a === "hero" && $method === "GET") {
    require_user();
    json_out(hero_document());
}

if ($a === "hero" && $method === "PUT") {
    require_user(["admin"]);
    json_out(save_hero(body_json()));
}

if ($a === "gallery" && $b === "" && $method === "GET") {
    require_user();
    json_out(["albums" => list_albums(), "photos" => list_photos()]);
}

if ($a === "gallery" && $b === "albums" && $c === "" && $method === "POST") {
    require_user(["admin"]);
    json_out(["album" => save_album(body_json())], 201);
}

if ($a === "gallery" && $b === "albums" && $c !== "" && $method === "PUT") {
    require_user(["admin"]);
    json_out(["album" => save_album(body_json(), $c)]);
}

if ($a === "gallery" && $b === "albums" && $c !== "" && $method === "DELETE") {
    require_user(["admin"]);
    delete_album($c);
    json_out(["ok" => true]);
}

if ($a === "gallery" && $b === "photos" && $method === "POST") {
    require_user(["admin"]);
    json_out(["photo" => add_photo(body_json())], 201);
}

if ($a === "gallery" && $b === "photos" && $c !== "" && $method === "DELETE") {
    require_user(["admin"]);
    delete_photo((int) $c);
    json_out(["ok" => true]);
}

if ($a === "media" && $method === "POST") {
    require_user(["admin"]);
    if (!isset($_FILES["file"])) {
        fail("Choose a file");
    }
    $file = $_FILES["file"];
    if ($file["error"] !== UPLOAD_ERR_OK) {
        fail("Upload failed");
    }
    if ($file["size"] > 8 * 1024 * 1024) {
        fail("File is larger than 8 MB");
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file["tmp_name"]);
    $map = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/webp" => "webp",
        "image/gif" => "gif",
    ];
    if (!isset($map[$mime])) {
        fail("Use a JPG, PNG, WEBP, or GIF image");
    }
    $dir = upload_dir();
    if (!is_dir($dir) && !mkdir($dir, 0775, true)) {
        fail("Upload folder is not writable", 500);
    }
    $name = bin2hex(random_bytes(16)) . "." . $map[$mime];
    if (!move_uploaded_file($file["tmp_name"], $dir . DIRECTORY_SEPARATOR . $name)) {
        fail("Could not store the file", 500);
    }
    json_out(["path" => "/uploads/" . $name]);
}

if ($a === "inquiries" && $b === "" && $method === "GET") {
    require_user();
    json_out(["inquiries" => list_inquiries()]);
}

if ($a === "inquiries" && $b === "" && $method === "POST") {
    json_out(["inquiry" => create_inquiry(body_json())], 201);
}

if ($a === "inquiries" && $b !== "" && $method === "PATCH") {
    require_user(["admin", "sales"]);
    json_out(["inquiry" => update_inquiry($b, body_json())]);
}

if ($a === "backups" && $b === "" && $method === "GET") {
    require_user(["admin"]);
    json_out(["backups" => list_backups()]);
}

if ($a === "backups" && $b === "" && $method === "POST") {
    require_user(["admin"]);
    json_out(["backup" => create_backup()], 201);
}

if ($a === "backups" && $b !== "" && $c === "restore" && $method === "POST") {
    require_user(["admin"]);
    json_out(restore_backup(rawurldecode($b)));
}

if ($a === "backups" && $b !== "" && $c === "" && $method === "GET") {
    require_user(["admin"]);
    send_backup(rawurldecode($b));
}

if ($a === "backups" && $b !== "" && $c === "" && $method === "DELETE") {
    require_user(["admin"]);
    delete_backup(rawurldecode($b));
    json_out(["ok" => true]);
}

json_out(["error" => "Not found"], 404);
