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

function signup() {
    $db = db();
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("Invalid email provided.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);
    
    } else {
        $stmt=$db->prepare('SELECT `email` FROM `users` WHERE `email`=:email');
        $stmt->execute(["email"=>$userinfo[0]]);
        if ($row=$stmt->fetch()) {
            return respond("Email already taken.",false);

        } else {
            $stmt=$db->prepare('INSERT INTO `users` (`email`,`password`) VALUES (:email,:password)');
            if ($stmt->execute(["email"=>$userinfo[0],"password"=>$userinfo[1]])) {
                return respond("Account created successfully.",true);
            }
        }
    }
}
?>