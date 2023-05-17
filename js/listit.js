function auth() {
    fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    
    fetch("API/login",{
        method:"POST",
        body:fd
    })
    
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        if (!data.result) {
            localStorage.removeItem("listitEmail");
            localStorage.removeItem("listitPassword");
            window.location.replace("index.html");
        }
    })
}

function logout() {
    localStorage.removeItem("listitEmail");
    localStorage.removeItem("listitPassword");
    window.location.replace("index.html");
}

auth();