auth();
lists();

var textboxManager = [];
setInterval(function(){manageTextboxes();}, 0);

function manageTextboxes() {
    for (let textBox in textboxManager) {
        let input = document.getElementById(textboxManager[textBox]);
        input.style.width = "0px";
        input.style.width = input.scrollWidth+"px";
    }
}

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
            addBar.classList = "removable";
            document.body.appendChild(addBar);

            let addInput = document.createElement("input");
            addInput.id = "addInput";
            addInput.placeholder = "New List";
            addBar.appendChild(addInput);

            let addBtn = document.createElement("button");
            addBtn.id = "addBtn";
            addBtn.onclick = function(){addList()};
            addBtn.innerHTML = "+";
            addBar.appendChild(addBtn);

            for (let list in slists) {
                let listBuilder = document.createElement("div");
                listBuilder.classList = "removable list";
                document.body.appendChild(listBuilder);

                let nameBuilder = document.createElement("input");
                nameBuilder.classList = "listName";
                nameBuilder.type = "text";
                nameBuilder.value = slists[list].name;
                nameBuilder.id = "nameBox"+slists[list].id;
                textboxManager.push("nameBox"+slists[list].id);
                nameBuilder.onblur = function(){changeName("nameBox"+slists[list].id)};
                listBuilder.appendChild(nameBuilder);
            }

        } else {
            console.log(data.message);
        }
    })
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

function addList() { 
    fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("name",document.getElementById("addInput").value);

    fetch("API/addlist",{
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
        if (data.result) {
            textboxManager = [];
            let remove = document.querySelectorAll(".removable");
            remove.forEach(element => {
                element.remove();
            })
            lists();

        }
    })
}