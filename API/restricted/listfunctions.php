<?php
require_once("universalfunctions.php");
require_once("userfunctions.php");

function lists($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else {
        $login = login($db);
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

function api_list($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else if (empty($_POST["listid"])) {
        return respond("No list id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('SELECT `itemid`,`itemname`,`status`,`amount` FROM `items` WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `list`=:listid');
            $stmt->execute(["email"=>$userinfo[0], "listid"=>filter_var($_POST["listid"], FILTER_SANITIZE_SPECIAL_CHARS)]);
            $items = array();
            while ($row=$stmt->fetch()) {
                $item = new stdClass();
                $item->id = $row["itemid"];
                $item->name = $row["itemname"];
                $item->status = $row["status"];
                $item->amount = $row["amount"];
                array_push($items,$item);
            }
            $stmt=$db->prepare('SELECT `listname` FROM `lists` WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email)');
            $stmt->execute(["email"=>$userinfo[0]]);

            $listname = filter_var($_POST["listid"], FILTER_SANITIZE_SPECIAL_CHARS);
            if ($row=$stmt->fetch()) {
                $listname = $row["listname"];
            }

            $response = respond("Items fetched successfully.",True);
            $response->items = $items;
            $response->name = $listname;
            return $response;

        } else {
            return $login;
        }
    }
}

function addlist($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else if (empty($_POST["name"])) {
        return respond("No list name provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('INSERT INTO `lists` (`user`,`listname`) VALUES ((SELECT `userid` FROM `users` WHERE `email`=:email),:listname)');
            if ($stmt->execute(["email"=>$userinfo[0],"listname"=>filter_var($_POST["name"],FILTER_SANITIZE_SPECIAL_CHARS)])) {
                return respond("List added successfully.",True);

            } else {
                return respond("Failed to add list.",False);
            }

        } else {
            return $login;
        }
    }
}

function editlist($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else if (empty($_POST["name"])) {
        return respond("No list name provided.",false);

    } else if (empty($_POST["listid"])) {
        return respond("No list id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('UPDATE `lists` SET `listname`=:listname WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `listid`=:listid');
            if ($stmt->execute(["listname"=>filter_var($_POST["name"],FILTER_SANITIZE_SPECIAL_CHARS),"email"=>$userinfo[0],"listid"=>filter_var($_POST["listid"], FILTER_SANITIZE_SPECIAL_CHARS)])) {
                return respond("List edited successfully.",True);

            } else {
                return respond("Failed to edit list.",False);
            }

        } else {
            return $login;
        }
    }
}

function dellist($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else if (empty($_POST["listid"])) {
        return respond("No list id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('DELETE FROM `lists` WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `listid`=:listid');
            if ($stmt->execute(["email"=>$userinfo[0],"listid"=>filter_var($_POST["listid"], FILTER_SANITIZE_SPECIAL_CHARS)])) {
                return respond("List deleted successfully.",True);

            } else {
                return respond("Failed to delete list.",False);
            }

        } else {
            return $login;
        }
    }
}
?>