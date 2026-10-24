<?php

/**
 * Copy this file to config.local.php on the server. Do not commit config.local.php.
 *
 * cPanel:
 * 1. Create a MySQL database and user, then set driver to "mysql".
 * 2. Set admin_password (10+ characters) and a long setup_key.
 * 3. Upload the api folder to public_html/api and open /api/install.php once.
 * 4. Add the live site origin to cors_origins if the admin is on another domain.
 * 5. Set notify_email to receive inquiry mail through the host mail() function.
 */
return [
    "db" => [
        "driver" => "mysql",
        "host" => "localhost",
        "port" => 3306,
        "name" => "ggm_admin",
        "user" => "ggm_admin",
        "pass" => "",
    ],
    "cors_origins" => [
        "https://ggmthai999.com",
        "https://www.ggmthai999.com",
        "http://localhost:3010",
        "http://127.0.0.1:3010",
    ],
    "admin_email" => "ggmthaimanagement@gmail.com",
    "admin_name" => "Admin",
    "admin_password" => "",
    "setup_key" => "",
    "notify_email" => "",
];
