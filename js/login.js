function loginsignup(method) {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let errmsg = document.getElementById("errmsg");
    
    if (email == "") {
        errmsg.innerHTML = "An email is required.";

    } else if (password == "") {
        errmsg.innerHTML = "A password is required.";

    } else {
        fd = new FormData;
        fd.append("email",email);
        fd.append("password",password);

        fetch("API/"+method,{
            method:"POST",
            body:fd
        })

        .then(response=>{
            if (response.status == 200) {
                return response.json();
            }
        })

        .then(data=>{
            if (data.result) {
                localStorage.setItem("listitEmail", email);
                localStorage.setItem("listitPassword", password);
                window.location.href = "listit.html";

            } else {
                errmsg.innerHTML = data.message;
            }
        })
    }
}