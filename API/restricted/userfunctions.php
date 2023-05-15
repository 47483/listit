<?php
require_once("universalfunctions.php");

function login() {
    $db = db();
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("No email provided.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else {
        $stmt=$db->prepare('SELECT `password` FROM `users` WHERE `email`=:email');
        $stmt->execute(["email"=>$userinfo[0]]);
        if ($row=$stmt->fetch()) {
            if (hash_equals($row["password"],$userinfo[1])) {
                return respond("Log in was successful.",true);

            } else {
                return respond("Wrong password.",false);
            }

        } else {
            return respond("Could not find user.",false);
        }
    }
}
?>