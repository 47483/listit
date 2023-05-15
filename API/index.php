<?php
require_once("restricted/userfunctions.php");
require_once("restricted/listfunctions.php");
require_once("restricted/itemfunctions.php");

$uri = filter_var($_SERVER['REQUEST_URI'], FILTER_UNSAFE_RAW);
$uriParts = explode("/",$uri);
$uriParts = array_filter($uriParts);

switch (end($uriParts)) {
    case "login":
        $return = login();
}

if (isset($return)) {
    header("Content-Type:application/json; charset=UTF-8");
    echo json_encode(login(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    readfile("info.html");
}
?>