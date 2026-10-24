<?php

require_once __DIR__ . "/db.php";

function backup_dir()
{
    $dir = data_dir() . "/backups";
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
    $guard = dirname($dir) . "/.htaccess";
    if (!is_file($guard)) {
        file_put_contents($guard, "Require all denied\n");
    }
    return $dir;
}

function backup_name_ok($name)
{
    return is_string($name) && preg_match("/^ggm-backup-\\d{8}-\\d{6}(?:-[a-f0-9]{4})?\\.zip$/", $name) === 1;
}

function backup_path($name)
{
    if (!backup_name_ok($name)) {
        fail("Backup not found", 404);
    }
    $path = backup_dir() . DIRECTORY_SEPARATOR . $name;
    if (!is_file($path)) {
        fail("Backup not found", 404);
    }
    $real = realpath($path);
    $base = realpath(backup_dir());
    if ($real === false || $base === false || strpos($real, $base . DIRECTORY_SEPARATOR) !== 0) {
        fail("Backup not found", 404);
    }
    return $real;
}

function backup_meta($path)
{
    return [
        "name" => basename($path),
        "size" => filesize($path),
        "createdAt" => gmdate("c", filemtime($path)),
    ];
}

function list_backups()
{
    $files = glob(backup_dir() . "/ggm-backup-*.zip");
    if (!is_array($files)) {
        return [];
    }
    rsort($files);
    $items = [];
    foreach ($files as $file) {
        if (backup_name_ok(basename($file))) {
            $items[] = backup_meta($file);
        }
    }
    return $items;
}

function backup_users()
{
    $rows = db()->query("SELECT email, password_hash, name, role, created_at FROM users ORDER BY id")->fetchAll();
    $users = [];
    foreach ($rows as $row) {
        $users[] = [
            "email" => $row["email"],
            "passwordHash" => $row["password_hash"],
            "name" => $row["name"],
            "role" => $row["role"],
            "createdAt" => $row["created_at"],
        ];
    }
    return $users;
}

function backup_payload()
{
    $counts = [
        "destinations" => count(list_destinations()),
        "tours" => count(list_tours(false)),
        "videos" => count(list_videos()),
        "albums" => count(list_albums()),
        "photos" => count(list_photos()),
        "inquiries" => count(list_inquiries()),
        "users" => count(backup_users()),
    ];
    return [
        "createdAt" => gmdate("c"),
        "counts" => $counts,
        "destinations" => list_destinations(),
        "tours" => list_tours(false),
        "videos" => list_videos(),
        "hero" => hero_document(),
        "albums" => list_albums(),
        "photos" => list_photos(),
        "inquiries" => list_inquiries(),
        "users" => backup_users(),
    ];
}

function add_upload_tree($zip, $uploadDir)
{
    if (!is_dir($uploadDir)) {
        return 0;
    }
    $added = 0;
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($uploadDir, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($iterator as $file) {
        if (!$file->isFile()) {
            continue;
        }
        $name = $file->getFilename();
        if (preg_match("/\\.(php|phtml|phar)$/i", $name)) {
            continue;
        }
        $relative = substr($file->getPathname(), strlen(rtrim($uploadDir, "\\/")) + 1);
        $relative = str_replace("\\", "/", $relative);
        if ($relative === "" || strpos($relative, "..") !== false) {
            continue;
        }
        $zip->addFile($file->getPathname(), "uploads/" . $relative);
        $added++;
    }
    return $added;
}

function prune_backups($keep = 20)
{
    $files = glob(backup_dir() . "/ggm-backup-*.zip");
    if (!is_array($files)) {
        return;
    }
    sort($files);
    while (count($files) > $keep) {
        $old = array_shift($files);
        if (is_file($old)) {
            unlink($old);
        }
    }
}

function create_backup()
{
    if (!class_exists("ZipArchive")) {
        fail("This server cannot create zip files. Enable the PHP zip extension.", 500);
    }
    $payload = backup_payload();
    $name = "ggm-backup-" . gmdate("Ymd-His") . ".zip";
    $path = backup_dir() . DIRECTORY_SEPARATOR . $name;
    if (is_file($path)) {
        $name = "ggm-backup-" . gmdate("Ymd-His") . "-" . bin2hex(random_bytes(2)) . ".zip";
        $path = backup_dir() . DIRECTORY_SEPARATOR . $name;
    }
    $zip = new ZipArchive();
    if ($zip->open($path, ZipArchive::CREATE) !== true) {
        fail("Could not create the backup file", 500);
    }
    $zip->addFromString(
        "backup.json",
        json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)
    );
    $files = add_upload_tree($zip, upload_dir());
    $zip->close();
    prune_backups(20);
    $meta = backup_meta($path);
    $meta["files"] = $files;
    $meta["counts"] = $payload["counts"];
    return $meta;
}

function send_backup($name)
{
    $path = backup_path($name);
    send_cors();
    header("Content-Type: application/zip");
    header("Content-Disposition: attachment; filename=\"" . basename($path) . "\"");
    header("Content-Length: " . filesize($path));
    header("Cache-Control: no-store");
    readfile($path);
    exit;
}

function delete_backup($name)
{
    $path = backup_path($name);
    if (!unlink($path)) {
        fail("Could not delete the backup", 500);
    }
}

function nullable_text($value)
{
    if (!is_string($value)) {
        return null;
    }
    $value = trim($value);
    return $value === "" ? null : $value;
}

function restore_backup($name)
{
    if (!class_exists("ZipArchive")) {
        fail("This server cannot read zip files. Enable the PHP zip extension.", 500);
    }
    $path = backup_path($name);
    $zip = new ZipArchive();
    if ($zip->open($path) !== true) {
        fail("Could not open the backup", 500);
    }
    $json = $zip->getFromName("backup.json");
    if ($json === false) {
        $zip->close();
        fail("This backup does not contain site data");
    }
    $payload = json_decode($json, true);
    if (!is_array($payload) || !isset($payload["destinations"]) || !isset($payload["tours"])) {
        $zip->close();
        fail("This backup file is invalid");
    }
    restore_payload($payload);
    $copied = restore_uploads($zip);
    $zip->close();
    return [
        "ok" => true,
        "copiedFiles" => $copied,
        "counts" => isset($payload["counts"]) ? $payload["counts"] : null,
    ];
}

function restore_payload($payload)
{
    $pdo = db();
    $pdo->beginTransaction();
    try {
        foreach (["gallery_photos", "gallery_albums", "videos", "tours", "destinations", "inquiries"] as $table) {
            $pdo->exec("DELETE FROM " . $table);
        }
        $pdo->exec("DELETE FROM documents WHERE doc_key = 'hero'");

        $order = 0;
        $destination = $pdo->prepare(
            "INSERT INTO destinations (slug, name, region, tagline, description, image, highlights, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($payload["destinations"] as $item) {
            $destination->execute([
                $item["slug"],
                $item["name"],
                $item["region"],
                $item["tagline"],
                $item["description"],
                $item["image"],
                json_encode(isset($item["highlights"]) ? $item["highlights"] : []),
                $order++,
            ]);
        }

        $order = 0;
        $tour = $pdo->prepare(
            "INSERT INTO tours (
                slug, code, title, destination_slugs, days, nights, type, categories, summary, highlights,
                image, validity, muslim_friendly, featured, status, itinerary, includes, excludes, sort_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($payload["tours"] as $item) {
            $tour->execute([
                $item["slug"],
                $item["code"],
                $item["title"],
                json_encode(isset($item["destinationSlugs"]) ? $item["destinationSlugs"] : []),
                (int) $item["duration"]["days"],
                (int) $item["duration"]["nights"],
                $item["type"],
                json_encode(isset($item["categories"]) ? $item["categories"] : []),
                $item["summary"],
                json_encode(isset($item["highlights"]) ? $item["highlights"] : []),
                $item["image"],
                isset($item["validity"]) ? $item["validity"] : null,
                !empty($item["muslimFriendly"]) ? 1 : 0,
                !empty($item["featured"]) ? 1 : 0,
                isset($item["status"]) ? $item["status"] : "published",
                json_encode(isset($item["itinerary"]) ? $item["itinerary"] : []),
                json_encode(isset($item["includes"]) ? $item["includes"] : []),
                json_encode(isset($item["excludes"]) ? $item["excludes"] : []),
                $order++,
            ]);
        }

        $order = 0;
        $video = $pdo->prepare(
            "INSERT INTO videos (youtube_id, title, location, destination, sort_order) VALUES (?, ?, ?, ?, ?)"
        );
        $videos = isset($payload["videos"]) && is_array($payload["videos"]) ? $payload["videos"] : [];
        foreach ($videos as $item) {
            $video->execute([
                $item["youtubeId"],
                $item["title"],
                $item["location"],
                $item["destination"],
                $order++,
            ]);
        }

        $hero = isset($payload["hero"]) && is_array($payload["hero"]) ? $payload["hero"] : ["shots" => [], "avatars" => []];
        $pdo->prepare("INSERT INTO documents (doc_key, body) VALUES ('hero', ?)")->execute([json_encode($hero)]);

        $order = 0;
        $album = $pdo->prepare(
            "INSERT INTO gallery_albums (id, code, market, title, date_label, cover, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $albums = isset($payload["albums"]) && is_array($payload["albums"]) ? $payload["albums"] : [];
        foreach ($albums as $item) {
            $album->execute([
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
        $photo = $pdo->prepare(
            "INSERT INTO gallery_photos (src, album_id, market, alt, width, height, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $photos = isset($payload["photos"]) && is_array($payload["photos"]) ? $payload["photos"] : [];
        foreach ($photos as $item) {
            $photo->execute([
                $item["src"],
                $item["albumId"],
                $item["market"],
                $item["alt"],
                (int) $item["width"],
                (int) $item["height"],
                $order++,
            ]);
        }

        $inquiry = $pdo->prepare(
            "INSERT INTO inquiries (
                id, created_at, name, email, phone, company, inquiry_type, tour_slug,
                destination_slug, travel_date, pax, message, status, note
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $inquiries = isset($payload["inquiries"]) && is_array($payload["inquiries"]) ? $payload["inquiries"] : [];
        foreach ($inquiries as $item) {
            $pax = isset($item["pax"]) && $item["pax"] !== "" ? (int) $item["pax"] : null;
            $inquiry->execute([
                isset($item["id"]) ? $item["id"] : ("inq-" . bin2hex(random_bytes(6))),
                isset($item["createdAt"]) ? $item["createdAt"] : now_stamp(),
                $item["name"],
                $item["email"],
                nullable_text(isset($item["phone"]) ? $item["phone"] : ""),
                nullable_text(isset($item["company"]) ? $item["company"] : ""),
                $item["inquiryType"],
                nullable_text(isset($item["tourSlug"]) ? $item["tourSlug"] : ""),
                nullable_text(isset($item["destinationSlug"]) ? $item["destinationSlug"] : ""),
                nullable_text(isset($item["travelDate"]) ? $item["travelDate"] : ""),
                $pax,
                $item["message"],
                isset($item["status"]) ? $item["status"] : "new",
                nullable_text(isset($item["note"]) ? $item["note"] : ""),
            ]);
        }

        $userInsert = $pdo->prepare(
            "INSERT INTO users (email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?)"
        );
        $users = isset($payload["users"]) && is_array($payload["users"]) ? $payload["users"] : [];
        foreach ($users as $item) {
            if (empty($item["email"]) || empty($item["passwordHash"]) || find_user_by_email($item["email"])) {
                continue;
            }
            $role = isset($item["role"]) ? $item["role"] : "viewer";
            if (!in_array($role, ["admin", "sales", "viewer"], true)) {
                $role = "viewer";
            }
            $userInsert->execute([
                strtolower(trim($item["email"])),
                $item["passwordHash"],
                isset($item["name"]) ? $item["name"] : "User",
                $role,
                isset($item["createdAt"]) ? $item["createdAt"] : now_stamp(),
            ]);
        }

        $pdo->commit();
    } catch (Exception $error) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $error;
    }
}

function restore_uploads($zip)
{
    $root = upload_dir();
    if (!is_dir($root) && !mkdir($root, 0775, true)) {
        fail("Upload folder is not writable", 500);
    }
    $base = realpath($root);
    if ($base === false) {
        fail("Upload folder is not writable", 500);
    }
    $copied = 0;
    for ($index = 0; $index < $zip->numFiles; $index++) {
        $entry = $zip->getNameIndex($index);
        if (!is_string($entry) || strpos($entry, "uploads/") !== 0 || substr($entry, -1) === "/") {
            continue;
        }
        $relative = substr($entry, strlen("uploads/"));
        if ($relative === "" || strpos($relative, "..") !== false || strpos($relative, ":") !== false) {
            continue;
        }
        if (preg_match("/\\.(php|phtml|phar)$/i", $relative)) {
            continue;
        }
        $target = $base . DIRECTORY_SEPARATOR . str_replace("/", DIRECTORY_SEPARATOR, $relative);
        $parent = dirname($target);
        if (!is_dir($parent) && !mkdir($parent, 0775, true)) {
            continue;
        }
        $parentReal = realpath($parent);
        if ($parentReal === false || strpos($parentReal, $base) !== 0) {
            continue;
        }
        $contents = $zip->getFromIndex($index);
        if ($contents === false) {
            continue;
        }
        file_put_contents($target, $contents);
        $copied++;
    }
    return $copied;
}
