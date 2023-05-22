auth();
if (localStorage.getItem("targetList")) {
    list(localStorage.getItem("targetList"));

} else {
    lists();
}

var touchEnabled = 'ontouchstart' in window;

var textboxManager = [];
var pressManager = {};
var mouseDown = false;
var delManager = {};

setInterval(function(){update();}, 0);

document.addEventListener("mouseup",function(){
    mouseDown = false;
    for (let pressable in pressManager) {
        pressManager[pressable] = false;
    }
})

document.addEventListener("mousemove",function(e){
    if (mouseDown) {
        for (let pressable in pressManager) {
            if (pressManager[pressable]) {
                pressManager[pressable] = [pressManager[pressable][0],pressManager[pressable][1],e.pageX,e.pageY,Date.now()];
            }
        }
    }
})

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
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace("index.html");
        }
    })
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("index.html");
}

function manageTextboxes() {
    for (let textBox in textboxManager) {
        let input = document.getElementById(textboxManager[textBox]);
        input.style.width = "0px";
        if (input.scrollWidth <= input.parentElement.scrollWidth/3*2) {
            input.style.width = input.scrollWidth+"px";

        } else {
            input.style.width = input.parentElement.scrollWidth/3*2+"px";
        }
    }
}

function managePresses() {
    deleteWarning(0,false);

    for (let pressable in pressManager) {
        document.getElementById(pressable).style.left = "0px";
        if (pressManager[pressable] != false) {
            let offset = (pressManager[pressable][0]-pressManager[pressable][2])*-1
            let screenWidth = document.body.clientWidth;
            
            if (!document.getElementById("popup")) {
                document.getElementById(pressable).style.left = offset+"px";
                if ((Date.now()-pressManager[pressable][4]) >= 500 && Math.abs(offset) <= screenWidth/50) {
                    if (pressable.split("-")[0] == "list") {
                        listPopup(pressable);

                    } else if (pressable.split("-")[0] == "item") {
                        //Popupbox for item
                    }
                }

                deleteWarning(Math.abs(offset)/screenWidth,true);

                delManager[pressable] = false;

                if (Math.abs(offset) > screenWidth/2) {
                    delManager[pressable] = true;
                }
            }

        } else {
            if (delManager[pressable]) {
                delete delManager[pressable];
                if (pressable.split("-")[0] == "list") {
                    delList(pressable.split("-")[1]);

                } else if (pressable.split("-")[0] == "item") {
                    //Remove item
                }
            }
        }
    }
}

function removeRemovable() {
    textboxManager = [];
    pressManager = {};
    let remove = document.querySelectorAll(".removable");
    remove.forEach(element => {
        element.remove();
    })
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
        document.body.style.overflowY = "auto";
    }
}

function deleteWarning(strength,add) {
    let remove = document.querySelectorAll(".deleteWarning");
    remove.forEach(element => {
        element.remove();
    })

    if (add) {
        let warningL = document.createElement("div");
        warningL.classList = "deleteWarning";
        warningL.style.left = 0;
        warningL.style.backgroundImage = `linear-gradient(to right, hsla(125,100%,60%,${strength/2}), hsla(125,100%,60%,0))`;
        document.body.appendChild(warningL);

        let warningR = document.createElement("div");
        warningR.classList = "deleteWarning";
        warningR.style.right = 0;
        warningR.style.backgroundImage = `linear-gradient(to left, hsla(125,100%,60%,${strength/2}), hsla(125,100%,60%,0))`;
        document.body.appendChild(warningR);
    }
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
            sessionStorage.removeItem("targetList");
            deletePopup();
            removeRemovable();

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
                    listBuilder.ontouchstart = function(e){pressManager["list-"+slists[list].id] = [e.touches[0].clientX,e.touches[0].clientY,e.touches[0].clientX,e.touches[0].clientY,Date.now()];};
                    listBuilder.ontouchmove = function(e){pressManager["list-"+slists[list].id] = [pressManager["list-"+slists[list].id][0],pressManager["list-"+slists[list].id][1],e.touches[0].clientX,e.touches[0].clientY,Date.now()];};
                    listBuilder.ontouchend = function(){pressManager["list-"+slists[list].id] = false;};

                } else {
                    listBuilder.onmousedown = function(e){pressManager["list-"+slists[list].id] = [e.pageX,e.pageY,e.pageX,e.pageY,Date.now()]; mouseDown = true;};
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
    document.body.style.overflowY = "hidden";
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
            removeRemovable();
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
            removeRemovable();
            lists();

        }
    })
}

function list(id) {
    fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("listid",id);
    
    fetch("API/list",{
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
            sessionStorage.setItem("targetList",id);
            deletePopup();
            removeRemovable();

            let items = data.items;

            let addBar = document.createElement("div");
            addBar.id = "addBar";
            addBar.classList = "removable";
            document.body.appendChild(addBar);

            let addInput = document.createElement("input");
            addInput.id = "addInput";
            addInput.placeholder = "New Item";
            addInput.autocomplete = "off";
            addBar.appendChild(addInput);

            let addBtn = document.createElement("button");
            addBtn.id = "addBtn";
            //Apply add function below
            addBtn.onclick = function(){};
            addBtn.innerHTML = "+";
            addBar.appendChild(addBtn);

            for (let item in items) {
                let itemBuilder = document.createElement("div");
                itemBuilder.classList = "removable item";
                itemBuilder.id = "item-"+items[item].id;
                
                if (touchEnabled) {
                    itemBuilder.ontouchstart = function(e){pressManager["item-"+items[item].id] = [e.touches[0].clientX,e.touches[0].clientY,e.touches[0].clientX,e.touches[0].clientY,Date.now()];};
                    itemBuilder.ontouchmove = function(e){pressManager["item-"+items[item].id] = [pressManager["item-"+items[item].id][0],pressManager["item-"+items[item].id][1],e.touches[0].clientX,e.touches[0].clientY,Date.now()];};
                    itemBuilder.ontouchend = function(){pressManager["item-"+items[item].id] = false;};

                } else {
                    itemBuilder.onmousedown = function(e){pressManager["item-"+items[item].id] = [e.pageX,e.pageY,e.pageX,e.pageY,Date.now()]; mouseDown = true;};
                }

                document.body.appendChild(itemBuilder);

                /**let nameBuilder = document.createElement("input");
                nameBuilder.classList = "listName";
                nameBuilder.type = "text";
                nameBuilder.value = slists[list].name;
                nameBuilder.id = "nameBox-"+slists[list].id;
                textboxManager.push("nameBox-"+slists[list].id);
                nameBuilder.onblur = function(){changeListName("nameBox-"+slists[list].id)};
                listBuilder.appendChild(nameBuilder);
                **/
            }

        } else {
            console.log(data.message);
        }
    })
}