<?php
function db():PDO {
    $dsn = 'mysql:dbname=listit_db;host=localhost';
    $dbUser='dbAccess';
    $dbPassword="letMeIn";
    $db = new PDO($dsn, $dbUser, $dbPassword);

    return $db;
}

function userinfo() {
    $email = null;
    $password = null;

    if (isset($_POST["email"])) {
        $email = filter_var($_POST["email"], FILTER_SANITIZE_SPECIAL_CHARS);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $email = null;
        }
    }

    if (isset($_POST["password"])) {
        $password = filter_var($_POST["password"], FILTER_SANITIZE_SPECIAL_CHARS);
        $password = hash("sha1", $password);
    }

    return [$email, $password];
}

function respond($msg, $result) {
    $response = new stdClass();
    $response->message = $msg;
    $response->result = $result;

    return $response;
}
?>