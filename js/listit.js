auth();
lists();

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
            sessionStorage.removeItem("targetList");
            window.location.replace("index.html");
        }
    })
}

function logout() {
    localStorage.removeItem("listitEmail");
    localStorage.removeItem("listitPassword");
    sessionStorage.removeItem("targetList");
    window.location.replace("index.html");
}

function lists() {
    fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    
    fetch("API/lists",{
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
            let slists = data.lists;

            let addBar = document.createElement("div");
            addBar.id = "addBar";
            document.body.appendChild(addBar);

            let addInput = document.createElement("input");
            addInput.id = "addInput";
            addInput.placeholder = "New List";
            addBar.appendChild(addInput);

            let addBtn = document.createElement("button");
            addBtn.id = "addBtn";
            addBtn.innerHTML = "+";
            addBar.appendChild(addBtn);

            for (let list in slists) {
                let listBuilder = document.createElement("div");
                listBuilder.classList = "list";
                document.body.appendChild(listBuilder);

                let nameBuilder = document.createElement("input");
                nameBuilder.classList = "listName";
                nameBuilder.type = "text";
                nameBuilder.value = slists[list].name;
                nameBuilder.id = slists[list].id;
                nameBuilder.onblur = function(){changeName(slists[list].id)};
                listBuilder.appendChild(nameBuilder);
                setInterval(function(){resizeInput(slists[list].id)},0);
            }

        } else {
            console.log(data.message);
        }
    })
}

function resizeInput(id) {
    let input = document.getElementById(id);
    input.style.width = "0px";
    input.style.width = input.scrollWidth+"px";
}

function changeName(id) {
    let input = document.getElementById(id);
    let previousValue = input.value;

    if (input.value == "") {
        input.value = "unnamed list";
    }

    if (input.className.split(" ").includes("listName")) {
        fd = new FormData;
        fd.append("email",localStorage.getItem("listitEmail"));
        fd.append("password",localStorage.getItem("listitPassword"));
        fd.append("listid",id);
        fd.append("name",input.value);
        
        fetch("API/editlist",{
            method:"POST",
            body:fd
        })
        
        .then(response=>{
            if (response.status == 200) {
                return response.json();
            }
        })
        
        .then(data=>{
            console.log(data.message);
            if (!data.result) {
                input.value = previousValue;
            }
        })
    }
}