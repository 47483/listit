//A function for logging in/signing up the user
function loginsignup(method) {
    //Get user-provided information from fields
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let errmsg = document.getElementById("errmsg");
    
    //Check if all required fields are supplied, else show errormessage
    if (email == "") {
        errmsg.innerHTML = "An email is required.";

    } else if (password == "") {
        errmsg.innerHTML = "A password is required.";

    } else {
        //Make a fetch request to the API using correct method and params
        fd = new FormData;
        fd.append("email",email);
        fd.append("password",password);

        fetch("API/"+method,{
            method:"POST",
            body:fd
        })

        //If response is valid continue
        .then(response=>{
            if (response.status == 200) {
                return response.json();
            }
        })

        //Store the correct user-info if response is positive, else show errormessage
        .then(data=>{
            if (data.result) {
                localStorage.setItem("listitEmail", email);
                localStorage.setItem("listitPassword", password);
                sessionStorage.setItem("targetList",false);
                window.location.href = "listit.html";

            } else {
                errmsg.innerHTML = data.message;
            }
        })
    }
}

//A function for authorizing the user using stored information
function auth() {
    //Make a fetch request using the stored data as params
    fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    
    fetch("API/login",{
        method:"POST",
        body:fd
    })
    
    //If response is valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    //If authorization returns positive, send user to main page, else empty stored data.
    .then(data=>{
        if (data.result) {
            window.location.replace("listit.html");

        } else {
            localStorage.clear();
            sessionStorage.clear();
        }
    })
}

//Call auth to automatically send user to page if logged in
auth();