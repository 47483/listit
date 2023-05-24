<?php
require_once("universalfunctions.php");
require_once("userfunctions.php");

function item($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else if (empty($_POST["itemid"])) {
        return respond("No item id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('SELECT `itemname`,`status`,`amount` FROM `items` WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `itemid`=:itemid');
            $stmt->execute(["email"=>$userinfo[0], "itemid"=>filter_var($_POST["itemid"], FILTER_SANITIZE_SPECIAL_CHARS)]);
            
            $response = respond("Item fetched successfully.",True);
            if ($row=$stmt->fetch()) {
                $response->name = $row["itemname"];
                $response->status = $row["status"];
                $response->amount = $row["amount"];

            } else {
                return respond("Invalid item id provided.",False);
            }

            return $response;

        } else {
            return $login;
        }
    }
}

function additem($db) {
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
        $login = login($db);
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

function edititem($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else if (empty($_POST["name"])) {
        return respond("No item name provided.",false);

    } else if (empty($_POST["itemid"])) {
        return respond("No item id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('UPDATE `items` SET `itemname`=:itemname WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `itemid`=:itemid');
            if ($stmt->execute(["itemname"=>filter_var($_POST["name"],FILTER_SANITIZE_SPECIAL_CHARS),"email"=>$userinfo[0],"itemid"=>filter_var($_POST["itemid"],FILTER_SANITIZE_SPECIAL_CHARS)])) {
                return respond("Item edited successfully.",True);

            } else {
                return respond("Failed to edit item.",False);
            }

        } else {
            return $login;
        }
    }
}

function edititemx($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else if (empty($_POST["count"])) {
        return respond("No item count provided.",false);

    } else if (empty($_POST["itemid"])) {
        return respond("No item id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $count = filter_var($_POST["count"],FILTER_SANITIZE_SPECIAL_CHARS);
            if ($count >= 0 && filter_var($count,FILTER_VALIDATE_INT)) {
                $stmt=$db->prepare('UPDATE `items` SET `amount`=:count WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `itemid`=:itemid');
                if ($stmt->execute(["count"=>$count,"email"=>$userinfo[0],"itemid"=>filter_var($_POST["itemid"],FILTER_SANITIZE_SPECIAL_CHARS)])) {
                    return respond("Item edited successfully.",True);

                } else {
                    return respond("Failed to edit item.",False);
                }

            } else {
                return respond("Invalid item count.",False);
            }

        } else {
            return $login;
        }
    }
}

function delitem($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else if (empty($_POST["itemid"])) {
        return respond("No item id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('DELETE FROM `items` WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `itemid`=:itemid');
            if ($stmt->execute(["email"=>$userinfo[0],"itemid"=>filter_var($_POST["itemid"],FILTER_SANITIZE_SPECIAL_CHARS)])) {
                return respond("Item deleted successfully.",True);

            } else {
                return respond("Failed to delete item.",False);
            }

        } else {
            return $login;
        }
    }
}

function deleteall($db) {
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
            $stmt=$db->prepare('DELETE FROM `items` WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `list`=:listid AND `status`=1');
            if ($stmt->execute(["email"=>$userinfo[0],"listid"=>filter_var($_POST["listid"],FILTER_SANITIZE_SPECIAL_CHARS)])) {
                return respond("Deleted all items successfully.",True);

            } else {
                return respond("Failed to delete all items.",False);
            }

        } else {
            return $login;
        }
    }
}

function complete($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    }  else if (empty($_POST["itemid"])) {
        return respond("No item id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('UPDATE `items` SET `status`=1 WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `itemid`=:itemid');
            if ($stmt->execute(["email"=>$userinfo[0],"itemid"=>filter_var($_POST["itemid"],FILTER_SANITIZE_SPECIAL_CHARS)])) {
                return respond("Item completed successfully.",True);

            } else {
                return respond("Failed to complete item.",False);
            }

        } else {
            return $login;
        }
    }
}

function completeall($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    }  else if (empty($_POST["listid"])) {
        return respond("No list id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('UPDATE `items` SET `status`=1 WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `list`=:listid');
            if ($stmt->execute(["email"=>$userinfo[0],"listid"=>filter_var($_POST["listid"],FILTER_SANITIZE_SPECIAL_CHARS)])) {
                return respond("Items completed successfully.",True);

            } else {
                return respond("Failed to complete items.",False);
            }

        } else {
            return $login;
        }
    }
}

function restore($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    }  else if (empty($_POST["itemid"])) {
        return respond("No item id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('UPDATE `items` SET `status`=0 WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `itemid`=:itemid');
            if ($stmt->execute(["email"=>$userinfo[0],"itemid"=>filter_var($_POST["itemid"],FILTER_SANITIZE_SPECIAL_CHARS)])) {
                return respond("Item restored successfully.",True);

            } else {
                return respond("Failed to restore item.",False);
            }

        } else {
            return $login;
        }
    }
}

function restoreall($db) {
    $userinfo = userinfo();

    if ($userinfo[0] == null) {
        return respond("A user email is required.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    }  else if (empty($_POST["listid"])) {
        return respond("No list id provided.",false);

    } else {
        $login = login($db);
        if (get_object_vars($login)["result"]) {
            $stmt=$db->prepare('UPDATE `items` SET `status`=0 WHERE `user` IN (SELECT `userid` FROM `users` WHERE `email`=:email) AND `list`=:listid');
            if ($stmt->execute(["email"=>$userinfo[0],"listid"=>filter_var($_POST["listid"],FILTER_SANITIZE_SPECIAL_CHARS)])) {
                return respond("Items restored successfully.",True);

            } else {
                return respond("Failed to restore items.",False);
            }

        } else {
            return $login;
        }
    }
}
?>