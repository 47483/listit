<?php
require_once("restricted/userfunctions.php");
require_once("restricted/listfunctions.php");
require_once("restricted/itemfunctions.php");

$uri = filter_var($_SERVER['REQUEST_URI'], FILTER_UNSAFE_RAW);
$uriParts = explode("/",$uri);
$uriParts = array_filter($uriParts);

$db = db();

switch (end($uriParts)) {
    case "login":
        $return = login($db);
        break;

    case "signup":
        $return = signup($db);
        break;

    case "lists":
        $return = lists($db);
        break;

    case "list":
        $return = api_list($db);
        break;

    case "addlist":
        $return = addlist($db);
        break;

    case "editlist":
        $return = editlist($db);
        break;

    case "dellist":
        $return = dellist($db);
        break;

    case "additem":
        $return = additem($db);
        break;

    case "edititem":
        $return = edititem($db);
        break;

    case "edititemx":
        $return = edititemx($db);
        break;

    case "delitem":
        $return = delitem($db);
        break;

    case "deleteall":
        $return = deleteall($db);
        break;

    case "complete":
        $return = complete($db);
        break;

    case "completeall":
        $return = completeall($db);
        break;

    case "restore":
        $return = restore($db);
        break;

    case "restoreall":
        $return = restoreall($db);
        break;
}

if (isset($return)) {
    header("Content-Type:application/json; charset=UTF-8");
    echo json_encode($return, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    readfile("info.html");
}
?>