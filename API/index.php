<?php
//Import required resources containing the functions
require_once("restricted/userfunctions.php");
require_once("restricted/listfunctions.php");
require_once("restricted/itemfunctions.php");

//Get the uri and add the uri-segments into a list
$uri = filter_var($_SERVER['REQUEST_URI'], FILTER_UNSAFE_RAW);
$uriParts = explode("/",$uri);
$uriParts = array_filter($uriParts);

//Make a reference to the database
$db = db();
//Look for self-test mode
$selftest = isset($_POST["selftest"]);

//Begin a db transaction if set to self-test mode
if ($selftest) {
    $db->beginTransaction();
}

//Choose which function to run depending on the last segment of the uri
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

    case "item":
        $return = item($db);
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

    case "testing":
        $testing = true;
        readfile("selftests.html");
        break;
}

//Rollback db if set to self-test mode
if ($selftest) {
    $db->rollBack();
}

//Check for a return at any function
if (isset($return)) {
    //Echo out the response of the function as JSON
    header("Content-Type:application/json; charset=UTF-8");
    echo json_encode($return, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} else if (empty($testing)) {
    //Return a info-page with the proper endpoints if not in self-test mode
    readfile("info.html");
}
?>