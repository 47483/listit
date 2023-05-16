<?php
require_once("universalfunctions.php");
require_once("userfunctions.php");

function lists() {
    $db = db();
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else {
        $login = login();
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('SELECT `listid`,`listname` FROM `lists` WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email)');
            $stmt->execute(["email"=>$userinfo[0]]);
            $lists = array();
            while ($row=$stmt->fetch()) {
                $list = new stdClass();
                $list->id = $row["listid"];
                $list->name = $row["listname"];
                array_push($lists,$list);
            }
            $response = respond("Lists fetched successfully.",True);
            $response->lists = $lists;
            return $response;

        } else {
            return $login;
        }
    }
}

function api_list() {
    $db = db();
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else if (empty($_POST["id"])) {
        return respond("No list id provided.",false);

    } else {
        $login = login();
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('SELECT `itemid`,`itemname`,`status`,`amount` FROM `items` WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `list`=:listid');
            $stmt->execute(["email"=>$userinfo[0], "listid"=>filter_var($_POST["id"], FILTER_SANITIZE_SPECIAL_CHARS)]);
            $items = array();
            while ($row=$stmt->fetch()) {
                $item = new stdClass();
                $item->id = $row["itemid"];
                $item->name = $row["itemname"];
                $item->status = $row["status"];
                $item->amount = $row["amount"];
                array_push($items,$item);
            }
            $response = respond("Items fetched successfully.",True);
            $response->items = $items;
            return $response;

        } else {
            return $login;
        }
    }
}
?>