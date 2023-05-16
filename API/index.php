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
        break;

    case "signup":
        $return = signup();
        break;

    case "lists":
        $return = lists();
        break;

    case "list":
        $return = api_list();
        break;

    case "addlist":
        $return = addlist();
        break;

    case "editlist":
        $return = editlist();
        break;

    case "dellist":
        $return = dellist();
        break;

    case "additem":
        $return = additem();
        break;

    case "edititem":
        $return = edititem();
        break;

    case "edititemx":
        $return = edititemx();
        break;

    case "delitem":
        $return = delitem();
        break;

    case "deleteall":
        $return = deleteall();
        break;

    case "complete":
        $return = complete();
        break;

    case "completeall":
        $return = completeall();
        break;

    case "restore":
        $return = restore();
        break;

    case "restoreall":
        $return = restoreall();
        break;
}

if (isset($return)) {
    header("Content-Type:application/json; charset=UTF-8");
    echo json_encode($return, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    readfile("info.html");
}
?>