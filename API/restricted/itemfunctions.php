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
        return respond("No list name provided.",false);

    } else {
        $login = login();
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('INSERT INTO `items` (`user`,`listname`) VALUES ((SELECT `userid` FROM `users` WHERE `email`=:email),:listname)');
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
?>