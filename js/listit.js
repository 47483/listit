auth();
pickPage();

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
    let fd = new FormData;
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

function pickPage() {
    if (sessionStorage.getItem("targetList")) {
        list(sessionStorage.getItem("targetList"));
    
    } else {
        lists();
    } 
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
        if (textboxManager[textBox].split("-")[0] == "countBox") {
            input.style.width = input.scrollWidth+"px";

        } else if (input.scrollWidth <= input.parentElement.scrollWidth/3*2) {
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
                        itemPopup(pressable);
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
                    delItem(pressable.split("-")[1]);
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
    sessionStorage.clear();
    deletePopup();
    removeRemovable();

    let fd = new FormData;
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
                nameBuilder.autocomplete = "off";
                textboxManager.push("nameBox-"+slists[list].id);
                nameBuilder.onblur = function(){changeObjectName("nameBox-"+slists[list].id);};
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

    let popupBG = document.createElement("div");
    popupBG.id = "popupBG";

    if (touchEnabled) {
        popupBG.ontouchstart = function(){deletePopup();};

    } else {
        popupBG.onmousedown = function(){deletePopup();};
    }

    document.body.appendChild(popupBG);

    let popup = document.createElement("div");
    popup.id = "popup";
    document.body.appendChild(popup);

    let title = document.createElement("p");
    title.innerHTML = "List Options";
    popup.appendChild(title);

    let openBtn = document.createElement("button");
    openBtn.innerHTML = "Open "+listName;
    openBtn.classList = "popupBtn";
    openBtn.onmouseup = function(){list(id.split("-")[1]);};
    popup.appendChild(openBtn);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete "+listName;
    deleteBtn.classList = "popupBtn";
    deleteBtn.onmouseup = function(){delList(id.split("-")[1]);};
    popup.appendChild(deleteBtn);
}

function changeObjectName(id) {
    let input = document.getElementById(id);

    if (input.value == "") {
        input.value = "unnamed";
    }

    if (input.className.split(" ").includes("listName")) {
        let fd = new FormData;
        fd.append("email",localStorage.getItem("listitEmail"));
        fd.append("password",localStorage.getItem("listitPassword"));
        fd.append("listid",id.split("-")[1]);
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
                getPrevName(input);
            }
        })
    } else if (input.className.split(" ").includes("itemName")) {
        let fd = new FormData;
        fd.append("email",localStorage.getItem("listitEmail"));
        fd.append("password",localStorage.getItem("listitPassword"));
        fd.append("itemid",id.split("-")[1]);
        fd.append("name",input.value);
        
        fetch("API/edititem",{
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
                getPrevName(input);
            }
        })
    }
}

function addList() {
    let fd = new FormData;
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
            pickPage();

        }
    })
}

function delList(id) {
    let fd = new FormData;
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
            pickPage();

        }
    })
}

function list(id) {
    sessionStorage.setItem("targetList",id);
    deletePopup();
    removeRemovable();

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
            let listTitle = document.createElement("div");
            listTitle.innerHTML = data.name;
            listTitle.id = "listTitle";
            listTitle.classList = "removable";
            document.body.appendChild(listTitle);

            let backBtn = document.createElement("div");
            backBtn.innerHTML = "Back To Lists";
            backBtn.id = "backBtn";
            backBtn.onclick = function(){lists();};
            backBtn.classList = "removable";
            document.body.appendChild(backBtn);

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
            addBtn.onclick = function(){addItem(id);};
            addBtn.innerHTML = "+";
            addBar.appendChild(addBtn);

            let incomplete = document.createElement("div");
            incomplete.classList = "removable";
            document.body.appendChild(incomplete);
            let complete = document.createElement("div");
            complete.classList = "removable";
            document.body.appendChild(complete);

            for (let item in items) {
                let itemBuilder = document.createElement("div");
                itemBuilder.id = "item-"+items[item].id;
                
                if (touchEnabled) {
                    itemBuilder.ontouchstart = function(e){pressManager["item-"+items[item].id] = [e.touches[0].clientX,e.touches[0].clientY,e.touches[0].clientX,e.touches[0].clientY,Date.now()];};
                    itemBuilder.ontouchmove = function(e){pressManager["item-"+items[item].id] = [pressManager["item-"+items[item].id][0],pressManager["item-"+items[item].id][1],e.touches[0].clientX,e.touches[0].clientY,Date.now()];};
                    itemBuilder.ontouchend = function(){pressManager["item-"+items[item].id] = false;};

                } else {
                    itemBuilder.onmousedown = function(e){pressManager["item-"+items[item].id] = [e.pageX,e.pageY,e.pageX,e.pageY,Date.now()]; mouseDown = true;};
                }

                if (items[item].status == true) {
                    itemBuilder.classList = "removable item complete";
                    complete.appendChild(itemBuilder);

                } else {
                    itemBuilder.classList = "removable item";
                    incomplete.appendChild(itemBuilder);
                }

                let checkBuilder = document.createElement("input");
                checkBuilder.type = "checkbox";
                checkBuilder.id = "checkBox-"+items[item].id;
                checkBuilder.checked = items[item].status;
                checkBuilder.onclick = function(){updateStatus(checkBuilder,true)};
                itemBuilder.appendChild(checkBuilder);

                let nameBox = document.createElement("div");
                nameBox.classList = "iBMaj";
                itemBuilder.appendChild(nameBox);

                let nameBuilder = document.createElement("input");
                nameBuilder.classList = "itemName";
                nameBuilder.type = "text";
                nameBuilder.value = items[item].name;
                nameBuilder.id = "inameBox-"+items[item].id;
                nameBuilder.autocomplete = "off";
                textboxManager.push("inameBox-"+items[item].id);
                nameBuilder.onblur = function(){changeObjectName("inameBox-"+items[item].id);};
                nameBox.appendChild(nameBuilder);

                let countBox = document.createElement("div");
                countBox.classList = "iBMin";
                countBox.innerHTML = "x";
                itemBuilder.appendChild(countBox);

                let countBuilder = document.createElement("input");
                countBuilder.classList = "itemName";
                countBuilder.type = "text";
                countBuilder.value = items[item].amount;
                countBuilder.id = "countBox-"+items[item].id;
                countBuilder.onblur = function(){editItemX("countBox-"+items[item].id);};
                textboxManager.push("countBox-"+items[item].id);
                countBox.append(countBuilder);
            }

        } else {
            console.log(data.message);
        }
    })
}

function addItem(listid) {
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("name",document.getElementById("addInput").value);
    fd.append("listid",listid);

    fetch("API/additem",{
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
            pickPage();
        }
    })
}

function delItem(id) {
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("itemid",id);

    fetch("API/delitem",{
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
            pickPage();

        }
    })
}

function deleteAll() {
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("listid",sessionStorage.getItem("targetList"));

    fetch("API/deleteall",{
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
            pickPage();
        }
    })
}

function itemPopup(id) {
    document.body.style.overflowY = "hidden";
    itemName = document.getElementById("inameBox-"+id.split("-")[1]).value;

    let popupBG = document.createElement("div");
    popupBG.id = "popupBG";

    if (touchEnabled) {
        popupBG.ontouchstart = function(){deletePopup();};

    } else {
        popupBG.onmousedown = function(){deletePopup();};
    }

    document.body.appendChild(popupBG);

    let popup = document.createElement("div");
    popup.id = "popup";
    document.body.appendChild(popup);

    let title = document.createElement("p");
    title.innerHTML = "Item Options";
    popup.appendChild(title);

    let checkBox = document.getElementById("checkBox-"+id.split("-")[1]);

    let completeBtn = document.createElement("button");
    completeBtn.classList = "popupBtn";
    completeBtn.onmouseup = function(){updateStatus(checkBox,false);};
    popup.appendChild(completeBtn);

    let completeallBtn = document.createElement("button");
    completeallBtn.classList = "popupBtn";
    completeallBtn.onmouseup = function(){updateStatusAll(checkBox);};
    popup.appendChild(completeallBtn);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete "+itemName;
    deleteBtn.classList = "popupBtn";
    deleteBtn.mouseup = function(){delItem(id.split("-")[1]);};
    popup.appendChild(deleteBtn);

    if (checkBox.checked) {
        completeBtn.innerHTML = "Restore "+itemName;
        completeallBtn.innerHTML = "Restore All";

        let deleteallBtn = document.createElement("button");
        deleteallBtn.classList = "popupBtn";
        deleteallBtn.innerHTML = "Delete All";
        deleteallBtn.onmouseup = function(){deleteAll();};
        popup.appendChild(deleteallBtn);

    } else {
        completeBtn.innerHTML = "Complete "+itemName;
        completeallBtn.innerHTML = "Complete All";
    }
}

function editItemX(id) {
    let input = document.getElementById(id);

    if (input.value == "") {
        input.value = 1;

    } else if (input.value < 1) {
        input.value = 1;

    } else if (input.value.length > 9) {
        input.value = 999999999;
    }

    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("itemid",id.split("-")[1]);
    fd.append("count",input.value);
    
    fetch("API/edititemx",{
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
            getPrevName(input);
        }
    })
}

function getPrevName(input) {
    let type = input.id.split("-")[0];

    if (type == "countBox" || type == "inameBox") {
        let fd = new FormData;
        fd.append("email",localStorage.getItem("listitEmail"));
        fd.append("password",localStorage.getItem("listitPassword"));
        fd.append("itemid",input.id.split("-")[1]);

        fetch("API/item",{
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
                if (type == "countBox") {
                    input.value = data.amount;

                } else {
                    input.value = data.name;
                }
            }
        })

    } else if (type == "nameBox") {
        let fd = new FormData;
        fd.append("email",localStorage.getItem("listitEmail"));
        fd.append("password",localStorage.getItem("listitPassword"));
        fd.append("listid",input.id.split("-")[1]);

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
            console.log(data.message);
            if (data.result) {
                input.value = data.name;
            }
        })
    }
}

function updateStatus(input,invert) {
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("itemid",input.parentElement.id.split("-")[1]);

    let method = "complete";

    if (input.checked) {
        method = "restore";
    }

    if (invert) {
        if (method == "complete") {
            method = "restore";

        } else {
            method = "complete";
        }
    }

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
        console.log(data.message);
        if (data.result) {
            pickPage();
        }
    })
}

function updateStatusAll(input) {
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("listid",sessionStorage.getItem("targetList"));

    let method = "completeall";

    if (input.checked) {
        method = "restoreall";
    }

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
        console.log(data.message);
        if (data.result) {
            pickPage();
        }
    })
}