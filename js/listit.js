auth();

if (sessionStorage.getItem("targetList")) {
    //Specific list thing

} else {
    lists();
}

var touchEnabled = 'ontouchstart' in window;

var textboxManager = [];
var pressManager = {};
setInterval(function(){update();}, 0);

function update() {
    manageTextboxes();
    managePresses();
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

function manageTextboxes() {
    for (let textBox in textboxManager) {
        let input = document.getElementById(textboxManager[textBox]);
        input.style.width = "0px";
        input.style.width = input.scrollWidth+"px";
    }
}

function managePresses() {
    screenWidth = document.body.clientWidth;
    for (let pressable in pressManager) {
        if (pressManager[pressable] && (Date.now()-pressManager[pressable]) >= 500) {
            if (!document.getElementById("popup")) {
                if (pressable.split("-")[0] == "list") {
                    listPopup(pressable);
                }
            }
        }
    }
}

function deletePopup() {
    popup = document.getElementById("popup");
    popupBG = document.getElementById("popupBG");

    if (popup) {
        popup.remove();
    }

    if (popupBG) {
        popupBG.remove();
    }

    if (popup || popupBG) {
        document.body.style.overflow = "auto";
    }
}

function lists() {
    sessionStorage.removeItem("targetList");
    deletePopup();

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
            addInput.autocomplete = "off";
            addBar.appendChild(addInput);

            let addBtn = document.createElement("button");
            addBtn.id = "addBtn";
            addBtn.onclick = function(){addList()};
            addBtn.innerHTML = "+";
            addBar.appendChild(addBtn);

            for (let list in slists) {
                let listBuilder = document.createElement("div");
                listBuilder.classList = "removable list";
                listBuilder.id = "list-"+slists[list].id;
                
                if (touchEnabled) {
                    listBuilder.ontouchstart = function(){pressManager["list-"+slists[list].id] = Date.now()};
                    listBuilder.ontouchend = function(){pressManager["list-"+slists[list].id] = false};

                } else {
                    listBuilder.onmousedown = function(){pressManager["list-"+slists[list].id] = Date.now()};
                    listBuilder.onmouseup = function(){pressManager["list-"+slists[list].id] = false};
                    listBuilder.onmouseout = function(){pressManager["list-"+slists[list].id] = false};
                }

                document.body.appendChild(listBuilder);

                let nameBuilder = document.createElement("input");
                nameBuilder.classList = "listName";
                nameBuilder.type = "text";
                nameBuilder.value = slists[list].name;
                nameBuilder.id = "nameBox-"+slists[list].id;
                textboxManager.push("nameBox-"+slists[list].id);
                nameBuilder.onblur = function(){changeListName("nameBox-"+slists[list].id)};
                listBuilder.appendChild(nameBuilder);
            }

        } else {
            console.log(data.message);
        }
    })
}

function listPopup(id) {
    document.body.style.overflow = "hidden";
    listName = document.getElementById("nameBox-"+id.split("-")[1]).value;

    popupBG = document.createElement("div");
    popupBG.id = "popupBG";

    if (touchEnabled) {
        popupBG.ontouchstart = function(){deletePopup();};

    } else {
        popupBG.onmousedown = function(){deletePopup();};
    }

    document.body.appendChild(popupBG);

    popup = document.createElement("div");
    popup.id = "popup";
    document.body.appendChild(popup);

    title = document.createElement("p");
    title.innerHTML = "List Options";
    popup.appendChild(title);

    openBtn = document.createElement("button");
    openBtn.innerHTML = "Open "+listName;
    openBtn.classList = "popupBtn";
    popup.appendChild(openBtn);

    deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete "+listName;
    deleteBtn.classList = "popupBtn";
    deleteBtn.onmouseup = function(){delList(id.split("-")[1]);};
    popup.appendChild(deleteBtn);
}

function changeListName(id) {
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
            pressManager = {};
            let remove = document.querySelectorAll(".removable");
            remove.forEach(element => {
                element.remove();
            })
            lists();

        }
    })
}

function delList(id) {
    fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("listid",id);

    fetch("API/dellist",{
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
            pressManager = {};
            let remove = document.querySelectorAll(".removable");
            remove.forEach(element => {
                element.remove();
            })
            lists();

        }
    })
}