<?php
//Require necessary functions
require_once("universalfunctions.php");

//A function for logging in the user
function login($db) {
    //Get user email and password
    $userinfo = userinfo();

    //Make sure all API-inputs are set, else return negative
    if ($userinfo[0] == null) {
        return respond("No email provided.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);

    } else {
        //Try to log in user using provided email and password, return accordingly
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

//A function for creating a new user
function signup($db) {
    //Get user email and password
    $userinfo = userinfo();

    //Make sure all API-inputs are set, else return negative
    if ($userinfo[0] == null) {
        return respond("Invalid email provided.",false);

    } else if ($userinfo[1] == null) {
        return respond("No password provided.",false);
    
    } else {
        //Check if provided email already exists, return negative if it does
        $stmt=$db->prepare('SELECT `email` FROM `users` WHERE `email`=:email');
        $stmt->execute(["email"=>$userinfo[0]]);
        if ($row=$stmt->fetch()) {
            return respond("Email already taken.",false);

        } else {
            //Add new user using provided params, return accordingly
            $stmt=$db->prepare('INSERT INTO `users` (`email`,`password`) VALUES (:email,:password)');
            if ($stmt->execute(["email"=>$userinfo[0],"password"=>$userinfo[1]])) {
                return respond("Account created successfully.",true);

            } else {
                return respond("Failed to create account.",false);
            }
        }
    }
}
?>