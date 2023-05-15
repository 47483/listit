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
                array_push($lists,array($row["listid"],$row["listname"]));
            }
            $response = respond("Lists fetched successfully.",True);
            $response->lists = $lists;
            return $response;

        } else {
            return $login;
        }
    }
}
?>