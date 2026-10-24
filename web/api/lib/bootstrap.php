<?php

class HttpError extends Exception
{
    public $status;

    public function __construct($message, $status = 400)
    {
        parent::__construct($message);
        $this->status = $status;
    }
}

function load_config($reload = false)
{
    static $config = null;
    static $loaded = false;
    if ($loaded && !$reload) {
        return $config;
    }
    $loaded = true;
    $path = dirname(__DIR__) . "/config.local.php";
    if (!is_file($path)) {
        return null;
    }
    $parsed = require $path;
    $config = is_array($parsed) ? $parsed : null;
    return $config;
}

function fail($message, $status = 400)
{
    throw new HttpError($message, $status);
}

function data_dir()
{
    static $dir = null;
    if ($dir !== null) {
        return $dir;
    }
    $config = load_config();
    if ($config && !empty($config["data_dir"]) && is_string($config["data_dir"])) {
        $dir = $config["data_dir"];
    } else {
        $privateParent = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . "private";
        if (is_dir($privateParent) && is_writable($privateParent)) {
            $dir = $privateParent . DIRECTORY_SEPARATOR . "ggm-data";
        } else {
            $dir = dirname(__DIR__) . DIRECTORY_SEPARATOR . "data";
        }
    }
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
    return $dir;
}

function log_error($message)
{
    $dir = data_dir();
    file_put_contents(
        $dir . "/error.log",
        gmdate("c") . " " . $message . "\n",
        FILE_APPEND
    );
}

function origin_allowed($origin)
{
    $config = load_config();
    if (!$config || !$origin) {
        return false;
    }
    $allowed = isset($config["cors_origins"]) && is_array($config["cors_origins"])
        ? $config["cors_origins"]
        : [];
    if (in_array($origin, $allowed, true)) {
        return true;
    }
    $parts = parse_url($origin);
    if (!$parts || empty($parts["host"])) {
        return false;
    }
    return $parts["host"] === "localhost" || $parts["host"] === "127.0.0.1";
}

function send_cors()
{
    $origin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";
    if (!$origin || !origin_allowed($origin)) {
        return;
    }
    header("Access-Control-Allow-Origin: " . $origin);
    header("Vary: Origin");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Max-Age: 600");
}

function json_out($data, $status = 200)
{
    send_cors();
    http_response_code($status);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function body_json()
{
    $raw = file_get_contents("php://input");
    if ($raw === false || trim($raw) === "") {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail("Invalid JSON");
    }
    return $data;
}

function upload_dir()
{
    $config = load_config();
    if ($config && !empty($config["upload_dir"])) {
        return $config["upload_dir"];
    }
    $parent = dirname(__DIR__, 2);
    if (is_dir($parent . "/public")) {
        return $parent . "/public/uploads";
    }
    return $parent . "/uploads";
}

set_exception_handler(function ($error) {
    $status = 500;
    $message = "Server error";
    if ($error instanceof HttpError) {
        $status = $error->status;
        $message = $error->getMessage();
    } else {
        log_error($error->getMessage());
    }
    json_out(["error" => $message], $status);
});
