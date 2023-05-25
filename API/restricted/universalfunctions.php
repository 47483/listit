<?php
//A function for connecting to the db
function db():PDO {
    //Use parameters below and return the connection
    $dsn = 'mysql:dbname=listit_db;host=localhost';
    $dbUser='dbAccess';
    $dbPassword="letMeIn";
    $db = new PDO($dsn, $dbUser, $dbPassword);

    return $db;
}

//A function for getting the users information
function userinfo() {
    $email = null;
    $password = null;

    //Check for provided email
    if (isset($_POST["email"])) {
        $email = filter_var($_POST["email"], FILTER_SANITIZE_SPECIAL_CHARS);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $email = null;
        }
    }

    //Check for provided password
    if (isset($_POST["password"])) {
        $password = filter_var($_POST["password"], FILTER_SANITIZE_SPECIAL_CHARS);
        $password = hash("sha1", $password);
    }

    //Return userinfo
    return [$email, $password];
}

//A function for creating responses
function respond($msg, $result) {
    //Create a JSON object using params and return
    $response = new stdClass();
    $response->message = $msg;
    $response->result = $result;

    return $response;
}
?>