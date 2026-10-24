<?php

require_once __DIR__ . "/bootstrap.php";

function db_driver()
{
    $config = load_config();
    $db = $config && isset($config["db"]) && is_array($config["db"]) ? $config["db"] : [];
    return isset($db["driver"]) ? $db["driver"] : "sqlite";
}

function db()
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $config = load_config();
    if (!$config) {
        fail("Server is not configured", 500);
    }
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    if (db_driver() === "mysql") {
        $db = $config["db"];
        $host = isset($db["host"]) ? $db["host"] : "localhost";
        $port = isset($db["port"]) ? (int) $db["port"] : 3306;
        $name = isset($db["name"]) ? $db["name"] : "";
        $user = isset($db["user"]) ? $db["user"] : "";
        $pass = isset($db["pass"]) ? $db["pass"] : "";
        $pdo = new PDO(
            "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
            $user,
            $pass,
            $options
        );
        return $pdo;
    }
    $dir = data_dir();
    $pdo = new PDO("sqlite:" . $dir . "/app.sqlite", null, null, $options);
    $pdo->exec("PRAGMA foreign_keys = ON");
    return $pdo;
}

function migrate()
{
    $pdo = db();
    if (db_driver() === "mysql") {
        $statements = [
            "CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(190) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(120) NOT NULL,
                role VARCHAR(20) NOT NULL,
                created_at VARCHAR(40) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS sessions (
                token_hash VARCHAR(64) PRIMARY KEY,
                user_id INT NOT NULL,
                expires_at VARCHAR(40) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS destinations (
                slug VARCHAR(120) PRIMARY KEY,
                name VARCHAR(160) NOT NULL,
                region VARCHAR(40) NOT NULL,
                tagline TEXT NOT NULL,
                description TEXT NOT NULL,
                image VARCHAR(255) NOT NULL,
                highlights TEXT NOT NULL,
                sort_order INT NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS tours (
                slug VARCHAR(160) PRIMARY KEY,
                code VARCHAR(40) NOT NULL,
                title VARCHAR(200) NOT NULL,
                destination_slugs TEXT NOT NULL,
                days INT NOT NULL,
                nights INT NOT NULL,
                type VARCHAR(20) NOT NULL,
                categories TEXT NOT NULL,
                summary TEXT NOT NULL,
                highlights TEXT NOT NULL,
                image VARCHAR(255) NOT NULL,
                validity VARCHAR(160) NULL,
                muslim_friendly TINYINT NOT NULL DEFAULT 0,
                featured TINYINT NOT NULL DEFAULT 0,
                status VARCHAR(20) NOT NULL,
                itinerary TEXT NOT NULL,
                includes TEXT NOT NULL,
                excludes TEXT NOT NULL,
                sort_order INT NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS videos (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                youtube_id VARCHAR(32) NOT NULL,
                title VARCHAR(200) NOT NULL,
                location VARCHAR(160) NOT NULL,
                destination VARCHAR(120) NOT NULL,
                sort_order INT NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS documents (
                doc_key VARCHAR(64) PRIMARY KEY,
                body TEXT NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS gallery_albums (
                id VARCHAR(120) PRIMARY KEY,
                code VARCHAR(120) NOT NULL,
                market VARCHAR(40) NOT NULL,
                title VARCHAR(200) NOT NULL,
                date_label VARCHAR(40) NOT NULL,
                cover VARCHAR(255) NOT NULL,
                sort_order INT NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS gallery_photos (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                src VARCHAR(255) NOT NULL,
                album_id VARCHAR(120) NOT NULL,
                market VARCHAR(40) NOT NULL,
                alt VARCHAR(255) NOT NULL,
                width INT NOT NULL,
                height INT NOT NULL,
                sort_order INT NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            "CREATE TABLE IF NOT EXISTS inquiries (
                id VARCHAR(40) PRIMARY KEY,
                created_at VARCHAR(40) NOT NULL,
                name VARCHAR(160) NOT NULL,
                email VARCHAR(190) NOT NULL,
                phone VARCHAR(40) NULL,
                company VARCHAR(160) NULL,
                inquiry_type VARCHAR(20) NOT NULL,
                tour_slug VARCHAR(160) NULL,
                destination_slug VARCHAR(120) NULL,
                travel_date VARCHAR(40) NULL,
                pax INT NULL,
                message TEXT NOT NULL,
                status VARCHAR(20) NOT NULL,
                note TEXT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
        ];
    } else {
        $statements = [
            "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at TEXT NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                expires_at TEXT NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS destinations (
                slug TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                region TEXT NOT NULL,
                tagline TEXT NOT NULL,
                description TEXT NOT NULL,
                image TEXT NOT NULL,
                highlights TEXT NOT NULL,
                sort_order INTEGER NOT NULL DEFAULT 0
            )",
            "CREATE TABLE IF NOT EXISTS tours (
                slug TEXT PRIMARY KEY,
                code TEXT NOT NULL,
                title TEXT NOT NULL,
                destination_slugs TEXT NOT NULL,
                days INTEGER NOT NULL,
                nights INTEGER NOT NULL,
                type TEXT NOT NULL,
                categories TEXT NOT NULL,
                summary TEXT NOT NULL,
                highlights TEXT NOT NULL,
                image TEXT NOT NULL,
                validity TEXT,
                muslim_friendly INTEGER NOT NULL DEFAULT 0,
                featured INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL,
                itinerary TEXT NOT NULL,
                includes TEXT NOT NULL,
                excludes TEXT NOT NULL,
                sort_order INTEGER NOT NULL DEFAULT 0
            )",
            "CREATE TABLE IF NOT EXISTS videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                youtube_id TEXT NOT NULL,
                title TEXT NOT NULL,
                location TEXT NOT NULL,
                destination TEXT NOT NULL,
                sort_order INTEGER NOT NULL DEFAULT 0
            )",
            "CREATE TABLE IF NOT EXISTS documents (
                doc_key TEXT PRIMARY KEY,
                body TEXT NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS gallery_albums (
                id TEXT PRIMARY KEY,
                code TEXT NOT NULL,
                market TEXT NOT NULL,
                title TEXT NOT NULL,
                date_label TEXT NOT NULL,
                cover TEXT NOT NULL,
                sort_order INTEGER NOT NULL DEFAULT 0
            )",
            "CREATE TABLE IF NOT EXISTS gallery_photos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                src TEXT NOT NULL,
                album_id TEXT NOT NULL,
                market TEXT NOT NULL,
                alt TEXT NOT NULL,
                width INTEGER NOT NULL,
                height INTEGER NOT NULL,
                sort_order INTEGER NOT NULL DEFAULT 0
            )",
            "CREATE TABLE IF NOT EXISTS inquiries (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                company TEXT,
                inquiry_type TEXT NOT NULL,
                tour_slug TEXT,
                destination_slug TEXT,
                travel_date TEXT,
                pax INTEGER,
                message TEXT NOT NULL,
                status TEXT NOT NULL,
                note TEXT
            )",
        ];
    }
    foreach ($statements as $sql) {
        $pdo->exec($sql);
    }
}

function json_list($value)
{
    $decoded = json_decode((string) $value, true);
    return is_array($decoded) ? $decoded : [];
}

function public_user($row)
{
    return [
        "id" => (int) $row["id"],
        "email" => $row["email"],
        "name" => $row["name"],
        "role" => $row["role"],
    ];
}

function now_stamp()
{
    return gmdate("Y-m-d H:i:s");
}

function create_user_record($email, $name, $password, $role)
{
    $stmt = db()->prepare(
        "INSERT INTO users (email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        strtolower(trim($email)),
        password_hash($password, PASSWORD_DEFAULT),
        $name,
        $role,
        now_stamp(),
    ]);
    return (int) db()->lastInsertId();
}

function find_user_by_email($email)
{
    $stmt = db()->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([strtolower(trim($email))]);
    $row = $stmt->fetch();
    return $row ? $row : null;
}

function find_user_by_id($id)
{
    $stmt = db()->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([(int) $id]);
    $row = $stmt->fetch();
    return $row ? $row : null;
}

function list_users()
{
    $rows = db()->query("SELECT id, email, name, role FROM users ORDER BY id")->fetchAll();
    return array_map("public_user", $rows);
}

function count_admins($exceptId = 0)
{
    $stmt = db()->prepare("SELECT COUNT(*) FROM users WHERE role = 'admin' AND id != ?");
    $stmt->execute([(int) $exceptId]);
    return (int) $stmt->fetchColumn();
}

function update_user_record($id, $fields)
{
    $user = find_user_by_id($id);
    if (!$user) {
        fail("User not found", 404);
    }
    $name = array_key_exists("name", $fields) ? trim((string) $fields["name"]) : $user["name"];
    $role = array_key_exists("role", $fields) ? $fields["role"] : $user["role"];
    if (!in_array($role, ["admin", "sales", "viewer"], true)) {
        fail("Invalid role");
    }
    if ($user["role"] === "admin" && $role !== "admin" && count_admins($id) < 1) {
        fail("Keep at least one admin");
    }
    if ($name === "") {
        fail("Name is required");
    }
    $stmt = db()->prepare("UPDATE users SET name = ?, role = ? WHERE id = ?");
    $stmt->execute([$name, $role, (int) $id]);
    if (!empty($fields["password"])) {
        if (strlen($fields["password"]) < 10) {
            fail("Password must be at least 10 characters");
        }
        $pass = db()->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
        $pass->execute([password_hash($fields["password"], PASSWORD_DEFAULT), (int) $id]);
    }
    return public_user(find_user_by_id($id));
}

function delete_user_record($id)
{
    $user = find_user_by_id($id);
    if (!$user) {
        fail("User not found", 404);
    }
    if ($user["role"] === "admin" && count_admins($id) < 1) {
        fail("Keep at least one admin");
    }
    $stmt = db()->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([(int) $id]);
    $sessions = db()->prepare("DELETE FROM sessions WHERE user_id = ?");
    $sessions->execute([(int) $id]);
}

function create_session($userId)
{
    $token = bin2hex(random_bytes(32));
    $stmt = db()->prepare(
        "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)"
    );
    $stmt->execute([
        hash("sha256", $token),
        (int) $userId,
        gmdate("Y-m-d H:i:s", time() + 60 * 60 * 12),
    ]);
    db()->exec("DELETE FROM sessions WHERE expires_at <= '" . now_stamp() . "'");
    return $token;
}

function delete_session($token)
{
    $stmt = db()->prepare("DELETE FROM sessions WHERE token_hash = ?");
    $stmt->execute([hash("sha256", $token)]);
}

function current_user()
{
    $header = "";
    if (!empty($_SERVER["HTTP_AUTHORIZATION"])) {
        $header = $_SERVER["HTTP_AUTHORIZATION"];
    } elseif (!empty($_SERVER["REDIRECT_HTTP_AUTHORIZATION"])) {
        $header = $_SERVER["REDIRECT_HTTP_AUTHORIZATION"];
    }
    if (stripos($header, "Bearer ") !== 0) {
        return null;
    }
    $token = trim(substr($header, 7));
    if ($token === "") {
        return null;
    }
    $stmt = db()->prepare(
        "SELECT u.id, u.email, u.name, u.role
         FROM sessions s JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = ? AND s.expires_at > ?"
    );
    $stmt->execute([hash("sha256", $token), now_stamp()]);
    $row = $stmt->fetch();
    return $row ? public_user($row) : null;
}

function require_user($roles = null)
{
    $user = current_user();
    if (!$user) {
        fail("Sign in required", 401);
    }
    if (is_array($roles) && !in_array($user["role"], $roles, true)) {
        fail("You do not have permission", 403);
    }
    return $user;
}

function bearer_token()
{
    $header = "";
    if (!empty($_SERVER["HTTP_AUTHORIZATION"])) {
        $header = $_SERVER["HTTP_AUTHORIZATION"];
    } elseif (!empty($_SERVER["REDIRECT_HTTP_AUTHORIZATION"])) {
        $header = $_SERVER["REDIRECT_HTTP_AUTHORIZATION"];
    }
    if (stripos($header, "Bearer ") !== 0) {
        return "";
    }
    return trim(substr($header, 7));
}

function safe_path($path)
{
    if (!is_string($path)) {
        return null;
    }
    $path = trim($path);
    if ($path === "" || strpos($path, "..") !== false) {
        return null;
    }
    if (!preg_match("#^/[A-Za-z0-9_./-]+$#", $path)) {
        return null;
    }
    return $path;
}

function require_path($path, $label)
{
    $safe = safe_path($path);
    if (!$safe) {
        fail("Invalid " . $label);
    }
    return $safe;
}

function string_list($value)
{
    if (is_string($value)) {
        $value = preg_split("/\r\n|\r|\n/", $value);
    }
    if (!is_array($value)) {
        return [];
    }
    $out = [];
    foreach ($value as $item) {
        if (!is_string($item) && !is_numeric($item)) {
            continue;
        }
        $item = trim((string) $item);
        if ($item !== "") {
            $out[] = $item;
        }
    }
    return $out;
}

function assert_slug($slug)
{
    if (!is_string($slug) || !preg_match("/^[a-z0-9]+(?:-[a-z0-9]+)*$/", $slug)) {
        fail("Use a lowercase slug with letters, numbers, and dashes");
    }
    return $slug;
}

function map_destination($row)
{
    return [
        "slug" => $row["slug"],
        "name" => $row["name"],
        "region" => $row["region"],
        "tagline" => $row["tagline"],
        "description" => $row["description"],
        "image" => $row["image"],
        "highlights" => string_list(json_list($row["highlights"])),
    ];
}

function list_destinations()
{
    $rows = db()->query("SELECT * FROM destinations ORDER BY sort_order, name")->fetchAll();
    return array_map("map_destination", $rows);
}

function destination_exists($slug)
{
    $stmt = db()->prepare("SELECT 1 FROM destinations WHERE slug = ?");
    $stmt->execute([$slug]);
    return (bool) $stmt->fetchColumn();
}

function save_destination($input, $existingSlug = null)
{
    $slug = assert_slug(isset($input["slug"]) ? $input["slug"] : "");
    if ($existingSlug !== null && $slug !== $existingSlug) {
        fail("Slug cannot be changed");
    }
    $regions = ["Central", "North", "South", "East"];
    $region = isset($input["region"]) ? $input["region"] : "";
    if (!in_array($region, $regions, true)) {
        fail("Choose a region");
    }
    $name = trim(isset($input["name"]) ? (string) $input["name"] : "");
    $tagline = trim(isset($input["tagline"]) ? (string) $input["tagline"] : "");
    $description = trim(isset($input["description"]) ? (string) $input["description"] : "");
    if ($name === "" || $tagline === "" || $description === "") {
        fail("Name, tagline, and description are required");
    }
    $image = require_path(isset($input["image"]) ? $input["image"] : "", "image");
    $highlights = string_list(isset($input["highlights"]) ? $input["highlights"] : []);
    if (!$highlights) {
        fail("Add at least one highlight");
    }
    $pdo = db();
    if ($existingSlug === null) {
        if (destination_exists($slug)) {
            fail("That slug is already used", 409);
        }
        $order = (int) $pdo->query("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM destinations")->fetchColumn();
        $stmt = $pdo->prepare(
            "INSERT INTO destinations (slug, name, region, tagline, description, image, highlights, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([$slug, $name, $region, $tagline, $description, $image, json_encode($highlights), $order]);
    } else {
        $stmt = $pdo->prepare(
            "UPDATE destinations SET name = ?, region = ?, tagline = ?, description = ?, image = ?, highlights = ? WHERE slug = ?"
        );
        $stmt->execute([$name, $region, $tagline, $description, $image, json_encode($highlights), $slug]);
    }
    $row = $pdo->prepare("SELECT * FROM destinations WHERE slug = ?");
    $row->execute([$slug]);
    return map_destination($row->fetch());
}

function delete_destination($slug)
{
    $stmt = db()->prepare("SELECT slug, destination_slugs FROM tours");
    $stmt->execute();
    foreach ($stmt->fetchAll() as $tour) {
        $slugs = json_list($tour["destination_slugs"]);
        if (in_array($slug, $slugs, true)) {
            fail("This destination is used by tour " . $tour["slug"], 409);
        }
    }
    $videos = db()->prepare("SELECT COUNT(*) FROM videos WHERE destination = ?");
    $videos->execute([$slug]);
    if ((int) $videos->fetchColumn() > 0) {
        fail("This destination still has videos", 409);
    }
    $del = db()->prepare("DELETE FROM destinations WHERE slug = ?");
    $del->execute([$slug]);
    if ($del->rowCount() < 1) {
        fail("Destination not found", 404);
    }
}

function map_tour($row)
{
    $tour = [
        "slug" => $row["slug"],
        "code" => $row["code"],
        "title" => $row["title"],
        "destinationSlugs" => string_list(json_list($row["destination_slugs"])),
        "duration" => ["days" => (int) $row["days"], "nights" => (int) $row["nights"]],
        "type" => $row["type"],
        "categories" => string_list(json_list($row["categories"])),
        "summary" => $row["summary"],
        "highlights" => string_list(json_list($row["highlights"])),
        "image" => $row["image"],
        "muslimFriendly" => (int) $row["muslim_friendly"] === 1,
        "featured" => (int) $row["featured"] === 1,
        "status" => $row["status"],
        "itinerary" => json_list($row["itinerary"]),
        "includes" => string_list(json_list($row["includes"])),
        "excludes" => string_list(json_list($row["excludes"])),
    ];
    if (!empty($row["validity"])) {
        $tour["validity"] = $row["validity"];
    }
    return $tour;
}

function list_tours($publishedOnly = false)
{
    $sql = "SELECT * FROM tours";
    if ($publishedOnly) {
        $sql .= " WHERE status = 'published'";
    }
    $sql .= " ORDER BY sort_order, title";
    return array_map("map_tour", db()->query($sql)->fetchAll());
}

function normalize_itinerary($value)
{
    if (!is_array($value)) {
        fail("Itinerary is required");
    }
    $days = [];
    $n = 1;
    foreach ($value as $day) {
        if (!is_array($day)) {
            continue;
        }
        $title = trim(isset($day["title"]) ? (string) $day["title"] : "");
        if ($title === "") {
            continue;
        }
        $item = [
            "day" => $n,
            "title" => $title,
            "meals" => trim(isset($day["meals"]) ? (string) $day["meals"] : ""),
            "activities" => string_list(isset($day["activities"]) ? $day["activities"] : []),
        ];
        if (!empty($day["image"])) {
            $image = safe_path($day["image"]);
            if ($image) {
                $item["image"] = $image;
            }
        }
        if (!$item["activities"]) {
            fail("Day {$n} needs at least one activity");
        }
        $days[] = $item;
        $n++;
    }
    if (!$days) {
        fail("Add at least one itinerary day");
    }
    return $days;
}

function save_tour($input, $existingSlug = null)
{
    $slug = assert_slug(isset($input["slug"]) ? $input["slug"] : "");
    if ($existingSlug !== null && $slug !== $existingSlug) {
        fail("Slug cannot be changed");
    }
    $code = strtoupper(trim(isset($input["code"]) ? (string) $input["code"] : ""));
    $title = trim(isset($input["title"]) ? (string) $input["title"] : "");
    $summary = trim(isset($input["summary"]) ? (string) $input["summary"] : "");
    if ($code === "" || $title === "" || $summary === "") {
        fail("Code, title, and summary are required");
    }
    $types = ["private", "sic", "join"];
    $type = isset($input["type"]) ? $input["type"] : "";
    if (!in_array($type, $types, true)) {
        fail("Choose a tour type");
    }
    $allowedCategories = ["city", "beach", "culture", "nature", "muslim-friendly"];
    $categories = array_values(array_intersect(string_list(isset($input["categories"]) ? $input["categories"] : []), $allowedCategories));
    if (!$categories) {
        fail("Choose at least one category");
    }
    $status = isset($input["status"]) ? $input["status"] : "draft";
    if (!in_array($status, ["published", "draft"], true)) {
        fail("Invalid status");
    }
    $days = isset($input["duration"]["days"]) ? (int) $input["duration"]["days"] : 0;
    $nights = isset($input["duration"]["nights"]) ? (int) $input["duration"]["nights"] : 0;
    if ($days < 1 || $days > 30 || $nights < 0 || $nights > 29) {
        fail("Check the duration");
    }
    $destinationSlugs = string_list(isset($input["destinationSlugs"]) ? $input["destinationSlugs"] : []);
    if (!$destinationSlugs) {
        fail("Choose at least one destination");
    }
    foreach ($destinationSlugs as $destinationSlug) {
        if (!destination_exists($destinationSlug)) {
            fail("Unknown destination " . $destinationSlug);
        }
    }
    $highlights = string_list(isset($input["highlights"]) ? $input["highlights"] : []);
    $includes = string_list(isset($input["includes"]) ? $input["includes"] : []);
    $excludes = string_list(isset($input["excludes"]) ? $input["excludes"] : []);
    if (!$highlights || !$includes) {
        fail("Add highlights and inclusions");
    }
    $image = require_path(isset($input["image"]) ? $input["image"] : "", "image");
    $itinerary = normalize_itinerary(isset($input["itinerary"]) ? $input["itinerary"] : []);
    $validity = trim(isset($input["validity"]) ? (string) $input["validity"] : "");
    $muslim = !empty($input["muslimFriendly"]) ? 1 : 0;
    $featured = !empty($input["featured"]) ? 1 : 0;
    $pdo = db();
    $codeOwner = $pdo->prepare("SELECT slug FROM tours WHERE code = ? AND slug != ?");
    $codeOwner->execute([$code, $existingSlug ? $existingSlug : ""]);
    if ($codeOwner->fetch()) {
        fail("That tour code is already used", 409);
    }
    $params = [
        $code,
        $title,
        json_encode($destinationSlugs),
        $days,
        $nights,
        $type,
        json_encode($categories),
        $summary,
        json_encode($highlights),
        $image,
        $validity !== "" ? $validity : null,
        $muslim,
        $featured,
        $status,
        json_encode($itinerary),
        json_encode($includes),
        json_encode($excludes),
    ];
    if ($existingSlug === null) {
        if (destination_exists($slug) && false) {
            fail("Slug already used");
        }
        $exists = $pdo->prepare("SELECT 1 FROM tours WHERE slug = ?");
        $exists->execute([$slug]);
        if ($exists->fetchColumn()) {
            fail("That slug is already used", 409);
        }
        $order = (int) $pdo->query("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM tours")->fetchColumn();
        $stmt = $pdo->prepare(
            "INSERT INTO tours (
                slug, code, title, destination_slugs, days, nights, type, categories, summary,
                highlights, image, validity, muslim_friendly, featured, status, itinerary, includes, excludes, sort_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute(array_merge([$slug], $params, [$order]));
    } else {
        $stmt = $pdo->prepare(
            "UPDATE tours SET
                code = ?, title = ?, destination_slugs = ?, days = ?, nights = ?, type = ?, categories = ?,
                summary = ?, highlights = ?, image = ?, validity = ?, muslim_friendly = ?, featured = ?,
                status = ?, itinerary = ?, includes = ?, excludes = ?
             WHERE slug = ?"
        );
        $stmt->execute(array_merge($params, [$slug]));
    }
    $row = $pdo->prepare("SELECT * FROM tours WHERE slug = ?");
    $row->execute([$slug]);
    return map_tour($row->fetch());
}

function delete_tour($slug)
{
    $stmt = db()->prepare("DELETE FROM tours WHERE slug = ?");
    $stmt->execute([$slug]);
    if ($stmt->rowCount() < 1) {
        fail("Tour not found", 404);
    }
}

function map_video($row)
{
    return [
        "id" => (int) $row["id"],
        "youtubeId" => $row["youtube_id"],
        "title" => $row["title"],
        "location" => $row["location"],
        "destination" => $row["destination"],
    ];
}

function list_videos()
{
    return array_map("map_video", db()->query("SELECT * FROM videos ORDER BY sort_order, id")->fetchAll());
}

function save_video($input, $id = null)
{
    $youtubeId = trim(isset($input["youtubeId"]) ? (string) $input["youtubeId"] : "");
    if (preg_match("#(?:v=|youtu\.be/|embed/|shorts/)([A-Za-z0-9_-]{6,20})#", $youtubeId, $match)) {
        $youtubeId = $match[1];
    }
    if (!preg_match("/^[A-Za-z0-9_-]{6,20}$/", $youtubeId)) {
        fail("Enter a YouTube link or video id");
    }
    $title = trim(isset($input["title"]) ? (string) $input["title"] : "");
    $location = trim(isset($input["location"]) ? (string) $input["location"] : "");
    $destination = assert_slug(isset($input["destination"]) ? $input["destination"] : "");
    if ($title === "" || $location === "") {
        fail("Title and location are required");
    }
    if (!destination_exists($destination)) {
        fail("Choose a destination that exists");
    }
    $pdo = db();
    if ($id === null) {
        $order = (int) $pdo->query("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM videos")->fetchColumn();
        $stmt = $pdo->prepare(
            "INSERT INTO videos (youtube_id, title, location, destination, sort_order) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([$youtubeId, $title, $location, $destination, $order]);
        $id = (int) $pdo->lastInsertId();
    } else {
        $stmt = $pdo->prepare(
            "UPDATE videos SET youtube_id = ?, title = ?, location = ?, destination = ? WHERE id = ?"
        );
        $stmt->execute([$youtubeId, $title, $location, $destination, (int) $id]);
        if ($stmt->rowCount() < 1 && !find_video($id)) {
            fail("Video not found", 404);
        }
    }
    return find_video($id);
}

function find_video($id)
{
    $stmt = db()->prepare("SELECT * FROM videos WHERE id = ?");
    $stmt->execute([(int) $id]);
    $row = $stmt->fetch();
    return $row ? map_video($row) : null;
}

function delete_video($id)
{
    $stmt = db()->prepare("DELETE FROM videos WHERE id = ?");
    $stmt->execute([(int) $id]);
    if ($stmt->rowCount() < 1) {
        fail("Video not found", 404);
    }
}

function hero_document()
{
    $stmt = db()->prepare("SELECT body FROM documents WHERE doc_key = 'hero'");
    $stmt->execute();
    $body = $stmt->fetchColumn();
    $data = $body ? json_decode($body, true) : null;
    if (!is_array($data)) {
        $data = ["shots" => [], "avatars" => []];
    }
    $shots = isset($data["shots"]) && is_array($data["shots"]) ? array_values($data["shots"]) : [];
    $avatars = [];
    if (isset($data["avatars"]) && is_array($data["avatars"])) {
        foreach ($data["avatars"] as $avatar) {
            $path = safe_path($avatar);
            if ($path) {
                $avatars[] = $path;
            }
        }
    }
    return ["shots" => $shots, "avatars" => $avatars];
}

function save_hero($input)
{
    $shotsIn = isset($input["shots"]) && is_array($input["shots"]) ? $input["shots"] : [];
    if (count($shotsIn) !== 4) {
        fail("The hero mosaic needs 4 photos");
    }
    $positions = ["bl", "tr", "tl", ""];
    $shots = [];
    foreach ($shotsIn as $shot) {
        if (!is_array($shot)) {
            fail("Invalid hero photo");
        }
        $item = [
            "src" => require_path(isset($shot["src"]) ? $shot["src"] : "", "hero image"),
            "alt" => trim(isset($shot["alt"]) ? (string) $shot["alt"] : ""),
        ];
        if ($item["alt"] === "") {
            fail("Each hero photo needs a description");
        }
        $script = trim(isset($shot["script"]) ? (string) $shot["script"] : "");
        if ($script !== "") {
            $item["script"] = $script;
            $position = isset($shot["scriptPosition"]) ? $shot["scriptPosition"] : "bl";
            if (!in_array($position, ["bl", "tr", "tl"], true)) {
                $position = "bl";
            }
            $item["scriptPosition"] = $position;
        }
        if (!empty($shot["wavy"])) {
            $item["wavy"] = true;
        }
        if (!empty($shot["aspect43"])) {
            $item["aspect43"] = true;
        }
        $objectPosition = trim(isset($shot["objectPosition"]) ? (string) $shot["objectPosition"] : "");
        if ($objectPosition !== "" && preg_match("/^object-\[[a-z0-9_%-]+\]$/", $objectPosition)) {
            $item["objectPosition"] = $objectPosition;
        }
        $shots[] = $item;
    }
    unset($positions);
    $avatars = [];
    $avatarInput = isset($input["avatars"]) && is_array($input["avatars"]) ? $input["avatars"] : [];
    foreach ($avatarInput as $avatar) {
        $path = safe_path(is_string($avatar) ? $avatar : "");
        if ($path) {
            $avatars[] = $path;
        }
    }
    if (count($avatars) > 6) {
        fail("Use up to 6 badge photos");
    }
    $payload = ["shots" => $shots, "avatars" => $avatars];
    $stmt = db()->prepare(
        "INSERT INTO documents (doc_key, body) VALUES ('hero', ?)"
    );
    if (db_driver() === "mysql") {
        db()->prepare(
            "INSERT INTO documents (doc_key, body) VALUES ('hero', ?)
             ON DUPLICATE KEY UPDATE body = VALUES(body)"
        )->execute([json_encode($payload)]);
    } else {
        db()->prepare(
            "INSERT INTO documents (doc_key, body) VALUES ('hero', ?)
             ON CONFLICT(doc_key) DO UPDATE SET body = excluded.body"
        )->execute([json_encode($payload)]);
    }
    unset($stmt);
    return hero_document();
}

function map_album($row, $count)
{
    return [
        "id" => $row["id"],
        "code" => $row["code"],
        "market" => $row["market"],
        "title" => $row["title"],
        "dateLabel" => $row["date_label"],
        "cover" => $row["cover"],
        "count" => (int) $count,
    ];
}

function album_counts()
{
    $counts = [];
    foreach (db()->query("SELECT album_id, COUNT(*) AS c FROM gallery_photos GROUP BY album_id") as $row) {
        $counts[$row["album_id"]] = (int) $row["c"];
    }
    return $counts;
}

function list_albums()
{
    $counts = album_counts();
    $rows = db()->query("SELECT * FROM gallery_albums ORDER BY sort_order, title")->fetchAll();
    $albums = [];
    foreach ($rows as $row) {
        $albums[] = map_album($row, isset($counts[$row["id"]]) ? $counts[$row["id"]] : 0);
    }
    return $albums;
}

function list_photos()
{
    $rows = db()->query("SELECT * FROM gallery_photos ORDER BY sort_order, id")->fetchAll();
    $photos = [];
    foreach ($rows as $row) {
        $photos[] = [
            "id" => (int) $row["id"],
            "src" => $row["src"],
            "albumId" => $row["album_id"],
            "market" => $row["market"],
            "alt" => $row["alt"],
            "width" => (int) $row["width"],
            "height" => (int) $row["height"],
        ];
    }
    return $photos;
}

function gallery_market($market)
{
    if (!in_array($market, ["Malaysia", "Singapore", "Indonesia", "Thailand"], true)) {
        fail("Choose a market");
    }
    return $market;
}

function save_album($input, $existingId = null)
{
    $id = assert_slug(isset($input["id"]) ? $input["id"] : "");
    if ($existingId !== null && $id !== $existingId) {
        fail("Album id cannot be changed");
    }
    $title = trim(isset($input["title"]) ? (string) $input["title"] : "");
    $code = trim(isset($input["code"]) ? (string) $input["code"] : "");
    $dateLabel = trim(isset($input["dateLabel"]) ? (string) $input["dateLabel"] : "");
    if ($title === "" || $code === "" || $dateLabel === "") {
        fail("Code, title, and date are required");
    }
    $market = gallery_market(isset($input["market"]) ? $input["market"] : "");
    $cover = require_path(isset($input["cover"]) ? $input["cover"] : "", "cover");
    $pdo = db();
    if ($existingId === null) {
        $exists = $pdo->prepare("SELECT 1 FROM gallery_albums WHERE id = ?");
        $exists->execute([$id]);
        if ($exists->fetchColumn()) {
            fail("That album id is already used", 409);
        }
        $order = (int) $pdo->query("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM gallery_albums")->fetchColumn();
        $stmt = $pdo->prepare(
            "INSERT INTO gallery_albums (id, code, market, title, date_label, cover, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([$id, $code, $market, $title, $dateLabel, $cover, $order]);
    } else {
        $stmt = $pdo->prepare(
            "UPDATE gallery_albums SET code = ?, market = ?, title = ?, date_label = ?, cover = ? WHERE id = ?"
        );
        $stmt->execute([$code, $market, $title, $dateLabel, $cover, $id]);
        $photos = $pdo->prepare("UPDATE gallery_photos SET market = ? WHERE album_id = ?");
        $photos->execute([$market, $id]);
    }
    $counts = album_counts();
    $row = $pdo->prepare("SELECT * FROM gallery_albums WHERE id = ?");
    $row->execute([$id]);
    return map_album($row->fetch(), isset($counts[$id]) ? $counts[$id] : 0);
}

function delete_album($id)
{
    $pdo = db();
    $pdo->prepare("DELETE FROM gallery_photos WHERE album_id = ?")->execute([$id]);
    $stmt = $pdo->prepare("DELETE FROM gallery_albums WHERE id = ?");
    $stmt->execute([$id]);
    if ($stmt->rowCount() < 1) {
        fail("Album not found", 404);
    }
}

function add_photo($input)
{
    $albumId = assert_slug(isset($input["albumId"]) ? $input["albumId"] : "");
    $album = db()->prepare("SELECT * FROM gallery_albums WHERE id = ?");
    $album->execute([$albumId]);
    $albumRow = $album->fetch();
    if (!$albumRow) {
        fail("Album not found", 404);
    }
    $src = require_path(isset($input["src"]) ? $input["src"] : "", "photo");
    $alt = trim(isset($input["alt"]) ? (string) $input["alt"] : "");
    if ($alt === "") {
        $alt = $albumRow["title"];
    }
    $width = isset($input["width"]) ? (int) $input["width"] : 1600;
    $height = isset($input["height"]) ? (int) $input["height"] : 1066;
    if ($width < 1) {
        $width = 1600;
    }
    if ($height < 1) {
        $height = 1066;
    }
    $order = (int) db()->query("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM gallery_photos")->fetchColumn();
    $stmt = db()->prepare(
        "INSERT INTO gallery_photos (src, album_id, market, alt, width, height, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$src, $albumId, $albumRow["market"], $alt, $width, $height, $order]);
    $id = (int) db()->lastInsertId();
    if ($albumRow["cover"] === "") {
        db()->prepare("UPDATE gallery_albums SET cover = ? WHERE id = ?")->execute([$src, $albumId]);
    }
    return [
        "id" => $id,
        "src" => $src,
        "albumId" => $albumId,
        "market" => $albumRow["market"],
        "alt" => $alt,
        "width" => $width,
        "height" => $height,
    ];
}

function delete_photo($id)
{
    $stmt = db()->prepare("DELETE FROM gallery_photos WHERE id = ?");
    $stmt->execute([(int) $id]);
    if ($stmt->rowCount() < 1) {
        fail("Photo not found", 404);
    }
}

function map_inquiry($row)
{
    $item = [
        "id" => $row["id"],
        "createdAt" => $row["created_at"],
        "name" => $row["name"],
        "email" => $row["email"],
        "inquiryType" => $row["inquiry_type"],
        "message" => $row["message"],
        "status" => $row["status"],
    ];
    foreach (["phone" => "phone", "company" => "company", "tour_slug" => "tourSlug", "destination_slug" => "destinationSlug", "travel_date" => "travelDate", "note" => "note"] as $column => $key) {
        if (!empty($row[$column])) {
            $item[$key] = $row[$column];
        }
    }
    if ($row["pax"] !== null && $row["pax"] !== "") {
        $item["pax"] = (int) $row["pax"];
    }
    return $item;
}

function list_inquiries()
{
    $rows = db()->query("SELECT * FROM inquiries ORDER BY created_at DESC")->fetchAll();
    return array_map("map_inquiry", $rows);
}

function create_inquiry($input)
{
    $name = trim(isset($input["name"]) ? (string) $input["name"] : "");
    $email = trim(isset($input["email"]) ? (string) $input["email"] : "");
    $message = trim(isset($input["message"]) ? (string) $input["message"] : "");
    $type = isset($input["inquiryType"]) ? $input["inquiryType"] : "general";
    if (strlen($name) < 2) {
        fail("Please enter your name");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail("Please enter a valid email");
    }
    if (strlen($message) < 10) {
        fail("Please provide a short message");
    }
    if (!in_array($type, ["tour", "transfer", "custom", "general"], true)) {
        fail("Invalid inquiry type");
    }
    $recent = db()->prepare("SELECT COUNT(*) FROM inquiries WHERE email = ? AND created_at >= ?");
    $recent->execute([strtolower($email), gmdate("Y-m-d H:i:s", time() - 3600)]);
    if ((int) $recent->fetchColumn() >= 8) {
        fail("Too many requests. Please try again later.", 429);
    }
    $id = "inq-" . bin2hex(random_bytes(6));
    $created = now_stamp();
    $phone = trim(isset($input["phone"]) ? (string) $input["phone"] : "");
    $company = trim(isset($input["company"]) ? (string) $input["company"] : "");
    $tourSlug = trim(isset($input["tourSlug"]) ? (string) $input["tourSlug"] : "");
    $destinationSlug = trim(isset($input["destinationSlug"]) ? (string) $input["destinationSlug"] : "");
    $travelDate = trim(isset($input["travelDate"]) ? (string) $input["travelDate"] : "");
    $pax = isset($input["pax"]) && $input["pax"] !== "" ? (int) $input["pax"] : null;
    if ($pax !== null && $pax < 1) {
        $pax = null;
    }
    $stmt = db()->prepare(
        "INSERT INTO inquiries (
            id, created_at, name, email, phone, company, inquiry_type, tour_slug,
            destination_slug, travel_date, pax, message, status, note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', NULL)"
    );
    $stmt->execute([
        $id,
        $created,
        $name,
        strtolower($email),
        $phone !== "" ? $phone : null,
        $company !== "" ? $company : null,
        $type,
        $tourSlug !== "" ? $tourSlug : null,
        $destinationSlug !== "" ? $destinationSlug : null,
        $travelDate !== "" ? $travelDate : null,
        $pax,
        $message,
    ]);
    $config = load_config();
    if ($config && !empty($config["notify_email"])) {
        $subjectName = str_replace(["\r", "\n"], "", $name);
        $body = "New inquiry from {$name} <{$email}>\nType: {$type}\n\n{$message}\n";
        @mail($config["notify_email"], "New GGM inquiry from {$subjectName}", $body);
    }
    $row = db()->prepare("SELECT * FROM inquiries WHERE id = ?");
    $row->execute([$id]);
    return map_inquiry($row->fetch());
}

function update_inquiry($id, $input)
{
    $stmt = db()->prepare("SELECT * FROM inquiries WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        fail("Inquiry not found", 404);
    }
    $status = array_key_exists("status", $input) ? $input["status"] : $row["status"];
    if (!in_array($status, ["new", "in-progress", "quoted", "closed"], true)) {
        fail("Invalid status");
    }
    $note = array_key_exists("note", $input) ? trim((string) $input["note"]) : (string) $row["note"];
    $update = db()->prepare("UPDATE inquiries SET status = ?, note = ? WHERE id = ?");
    $update->execute([$status, $note !== "" ? $note : null, $id]);
    $stmt->execute([$id]);
    return map_inquiry($stmt->fetch());
}

function public_content()
{
    $hero = hero_document();
    return [
        "destinations" => list_destinations(),
        "tours" => list_tours(true),
        "videos" => list_videos(),
        "heroMosaic" => $hero["shots"],
        "heroBadgeAvatars" => $hero["avatars"],
        "galleryAlbums" => list_albums(),
        "galleryPhotos" => list_photos(),
    ];
}

function catalog_content()
{
    return [
        "destinations" => list_destinations(),
        "tours" => list_tours(true),
    ];
}

function admin_stats()
{
    $tours = list_tours(false);
    $published = 0;
    foreach ($tours as $tour) {
        if ($tour["status"] === "published") {
            $published++;
        }
    }
    $inquiries = list_inquiries();
    $fresh = 0;
    foreach ($inquiries as $inquiry) {
        if ($inquiry["status"] === "new") {
            $fresh++;
        }
    }
    return [
        "tours" => $published,
        "draftTours" => count($tours) - $published,
        "destinations" => count(list_destinations()),
        "inquiries" => count($inquiries),
        "newInquiries" => $fresh,
    ];
}

function seed_content($payload)
{
    $pdo = db();
    $pdo->beginTransaction();
    try {
        $order = 0;
        $stmt = $pdo->prepare(
            "INSERT INTO destinations (slug, name, region, tagline, description, image, highlights, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($payload["destinations"] as $item) {
            $stmt->execute([
                $item["slug"],
                $item["name"],
                $item["region"],
                $item["tagline"],
                $item["description"],
                $item["image"],
                json_encode($item["highlights"]),
                $order++,
            ]);
        }
        $order = 0;
        $tourStmt = $pdo->prepare(
            "INSERT INTO tours (
                slug, code, title, destination_slugs, days, nights, type, categories, summary, highlights,
                image, validity, muslim_friendly, featured, status, itinerary, includes, excludes, sort_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($payload["tours"] as $item) {
            $tourStmt->execute([
                $item["slug"],
                $item["code"],
                $item["title"],
                json_encode($item["destinationSlugs"]),
                (int) $item["duration"]["days"],
                (int) $item["duration"]["nights"],
                $item["type"],
                json_encode($item["categories"]),
                $item["summary"],
                json_encode($item["highlights"]),
                $item["image"],
                isset($item["validity"]) ? $item["validity"] : null,
                !empty($item["muslimFriendly"]) ? 1 : 0,
                !empty($item["featured"]) ? 1 : 0,
                isset($item["status"]) ? $item["status"] : "published",
                json_encode($item["itinerary"]),
                json_encode($item["includes"]),
                json_encode($item["excludes"]),
                $order++,
            ]);
        }
        $order = 0;
        $videoStmt = $pdo->prepare(
            "INSERT INTO videos (youtube_id, title, location, destination, sort_order) VALUES (?, ?, ?, ?, ?)"
        );
        foreach ($payload["videos"] as $item) {
            $videoStmt->execute([
                $item["youtubeId"],
                $item["title"],
                $item["location"],
                $item["destination"],
                $order++,
            ]);
        }
        $hero = [
            "shots" => $payload["heroMosaic"],
            "avatars" => $payload["heroBadgeAvatars"],
        ];
        $pdo->prepare("INSERT INTO documents (doc_key, body) VALUES ('hero', ?)")->execute([json_encode($hero)]);
        $order = 0;
        $albumStmt = $pdo->prepare(
            "INSERT INTO gallery_albums (id, code, market, title, date_label, cover, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($payload["galleryAlbums"] as $item) {
            $albumStmt->execute([
                $item["id"],
                $item["code"],
                $item["market"],
                $item["title"],
                $item["dateLabel"],
                $item["cover"],
                $order++,
            ]);
        }
        $order = 0;
        $photoStmt = $pdo->prepare(
            "INSERT INTO gallery_photos (src, album_id, market, alt, width, height, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($payload["galleryPhotos"] as $item) {
            $photoStmt->execute([
                $item["src"],
                $item["albumId"],
                $item["market"],
                $item["alt"],
                (int) $item["width"],
                (int) $item["height"],
                $order++,
            ]);
        }
        $pdo->commit();
    } catch (Exception $error) {
        $pdo->rollBack();
        throw $error;
    }
}
