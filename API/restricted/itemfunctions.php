<?php
require_once("universalfunctions.php");
require_once("userfunctions.php");

function additem() {
    $db = db();
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else if (empty($_POST["name"])) {
        return respond("No item name provided.",false);

    } else if (empty($_POST["listid"])) {
        return respond("No list id provided.",false);

    } else {
        $login = login();
        if (get_object_vars($login)["result"]) {
            $listid = filter_var($_POST["listid"],FILTER_SANITIZE_SPECIAL_CHARS);
            $stmt=$db->prepare('SELECT `listid` FROM `lists` WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `listid`=:listid');
            $stmt->execute(["email"=>$userinfo[0],"listid"=>$listid]);
            if ($row=$stmt->fetch()) {
                $stmt=$db->prepare('INSERT INTO `items` (`user`,`list`,`itemname`,`status`,`amount`) VALUES ((SELECT `userid` FROM `users` WHERE `email`=:email),:listid,:itemname,0,1)');
                if ($stmt->execute(["email"=>$userinfo[0],"listid"=>$listid,"itemname"=>filter_var($_POST["name"],FILTER_SANITIZE_SPECIAL_CHARS)])) {
                    return respond("Item added successfully.",True);
    
                } else {
                    return respond("Failed to add item.",False);
                }

            } else {
                return respond("There is no list with id $listid.",False);
            }

        } else {
            return $login;
        }
    }
}
?>