//Run when page loaded
window.onload = function() {
    //Get a reference to the page wrapper
    var wrapper = document.getElementById("wrapper");

    //Begin continuous updating
    setInterval(function(){update();}, 0);

    //Check for stored destination data, load correct page
    pickPage();
}

//Authorize user, redirect if response is negative
auth();

//A bool to keep track if the device uses mouse or touch
var touchEnabled = 'ontouchstart' in window;

//Managers for specified functionality
var textboxManager = [];
var pressManager = {};
var delManager = {};
var durations = {};

//A bool keeping track on mouse pressing
var mouseDown = false;
var popupWhenClick = false;

//Create eventlisteners for keeping track on some globally used mouse/touch actions
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

if (touchEnabled) {
    document.addEventListener("touchstart",function(){
        if (document.getElementById("popup")) {
            popupWhenClick = true;
        }
    })

} else {
    document.addEventListener("mousedown",function(){
        if (document.getElementById("popup")) {
            popupWhenClick = true;
        }
    })
}

//A function that will be called continuously
function update() {
    //Resize textboxes to content dynamically
    manageTextboxes();
    //Keep track on what is being pressed
    managePresses();

    //Set the padding of the wrapper and itemdivs
    let padding = (window.innerWidth-window.innerHeight)/2;
    if (padding < 0) {
        padding = 0;
    }
    wrapper.style.paddingLeft = padding+"px";
    wrapper.style.paddingRight = padding+"px";

    let ic = document.getElementById("incomplete");
    let c = document.getElementById("complete");

    if (ic) {
        ic.style.paddingLeft = padding+"px";
        ic.style.paddingRight = padding+"px";
    }

    if (c) {
        c.style.paddingLeft = padding+"px";
        c.style.paddingRight = padding+"px";
    }
}

//A function that authorizes the user
function auth() {
    //Preform API-login using stored params
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    
    fetch("API/login",{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    //Redirect if user data doesn't match
    .then(data=>{
        if (!data.result) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace("index.html");
        }
    })
}

//A function for selecting the page which to display
function pickPage() {
    removeRemovable();
    //Check for a target list, and if it exists show it
    if (sessionStorage.getItem("targetList") && sessionStorage.getItem("targetList") != "false") {
        list(sessionStorage.getItem("targetList"));
    
    } else {
        //Show the main overview page
        lists();
    } 
}

//A function for logging out the user
function logout() {
    //Clear all stored user-info and redirect to login-page
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("index.html");
}

//A function for resizing textboxes to content size
function manageTextboxes() {
    //Iterate over all boxes to manage
    for (let textBox in textboxManager) {
        //Get the element which to resize
        let input = document.getElementById(textboxManager[textBox]);
        //Set width to 0 to get the full scrollWidth
        input.style.width = "0px";
        //Change behaviour based on the type of input managed
        if (textboxManager[textBox].split("-")[0] == "countBox") {
            //Set width to full scrollWidth
            input.style.width = input.scrollWidth+"px";

        } else if (input.scrollWidth <= input.parentElement.scrollWidth/3*2) {
            //Set width to full scrollWidth
            input.style.width = input.scrollWidth+"px";

        } else {
            //Set width to the max scrollWidth allowed by the parent element
            input.style.width = input.parentElement.scrollWidth/3*2+"px";
        }
    }
}

//A function for managing presses and swipe-delete
function managePresses() {

    //Iterate over all pressable things
    for (let pressable in pressManager) {
        //Set the horizontal offset of the element to 0
        document.getElementById(pressable).style.left = "0px";
        //Check if the element is being pressed
        if (pressManager[pressable] != false) {
            //Get some variables used for swipe-deleting
            let offset = (pressManager[pressable][0]-pressManager[pressable][2])*-1
            let screenWidth = document.body.clientWidth;
            
            //Check if the page has a popup on it
            if (!document.getElementById("popup")) {
                //Set the swiped offset of the element
                document.getElementById(pressable).style.left = offset+"px";

                let visibility = 100-(Math.abs(offset)/(screenWidth/4))*100;
                if (visibility < 0) {visibility = 0;}
                document.getElementById(pressable).style.filter = `opacity(${visibility}%)`;
                //Check if the element has been pressed for 500 ms or more and is not greatly offset
                if ((Date.now()-pressManager[pressable][4]) >= 500 && Math.abs(offset) <= screenWidth/50) {
                    //Add a popup according to the type of element pressed
                    if (pressable.split("-")[0] == "list") {
                        listPopup(pressable);

                    } else if (pressable.split("-")[0] == "item") {
                        itemPopup(pressable);
                    }
                }

                //Set the current element as not about to be deleted
                delManager[pressable] = false;

                //Check if element has been moved half the screen width
                if (Math.abs(offset) > screenWidth/4) {
                    //Set the element as about to be deleted
                    delManager[pressable] = true;
                }
            }

        } else {
            //Check if the element has been pressed for less than 500 ms
            if (Date.now()-durations[pressable] < 500) {
                list(pressable.split("-")[1]);
                durations = {};

            } else {
                durations = {};
            }
            
            //Check if the element is about to be deleted
            if (delManager[pressable]) {
                //Delete element and from UI and call the corresponding API function
                delete delManager[pressable];
                if (pressable.split("-")[0] == "list") {
                    delList(pressable.split("-")[1]);

                } else if (pressable.split("-")[0] == "item") {
                    delItem(pressable.split("-")[1]);
                }
            }

            if (delManager[pressable] != null) {
                //Set the opacity of the element to 100%
                document.getElementById(pressable).style.filter = `opacity(100%)`;
            }
        }
    }
}

function resetManagers() {
    textboxManager = [];
    pressManager = {};
    delManager = {};
    durations = {};
}

//A function for removing all "removable" elements from the scene
function removeRemovable() {
    //Reset managers
    resetManagers();
    //Remove all elements with class "removable"
    let remove = document.querySelectorAll(".removable");
    remove.forEach(element => {
        element.remove();
    })
}

//A function for deleting a popup
function deletePopup() {
    popupWhenClick = false;
    //Get the elements of the popup
    popup = document.getElementById("popup");
    popupBG = document.getElementById("popupBG");

    //Check if they exist and then remove them individually
    if (popup) {
        popup.remove();
    }

    if (popupBG) {
        popupBG.remove();
    }
}

//A function for fetching all lists for user
function lists() {
    //Clear target page
    sessionStorage.clear();
    //Remove popup
    deletePopup();
    //Remove other page elements
    removeRemovable();

    //Fetch lists using stored params
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    
    fetch("API/lists",{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        //If response is positive
        if (data.result) {
            //Create a list of all lists
            let slists = data.lists;

            //Create a button for logging out
            let backBtn = document.createElement("div");
            backBtn.innerHTML = "Log Out";
            backBtn.onclick = function(){logout();};
            backBtn.classList = "removable backBtn";
            wrapper.appendChild(backBtn);

            //Create a bar with a input and a button for adding a new list
            let addBar = document.createElement("div");
            addBar.id = "addBar";
            addBar.classList = "removable";
            wrapper.appendChild(addBar);

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

            //Iterate over all lists
            for (let list in slists) {
                //Create list element
                buildList(slists[list].id,slists[list].name);
            }

        } else {
            //Send response to console
            console.log(data.message);
        }
    })
}

//A function for creating a popup for list options
function listPopup(id) {
    //Get list name
    listName = document.getElementById("nameBox-"+id.split("-")[1]).value;

    //Create a popup and a background filter
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

    //Create a title for the list options
    let title = document.createElement("p");
    title.innerHTML = "List Options";
    popup.appendChild(title);

    //Create a button for opening the list
    let openBtn = document.createElement("button");
    openBtn.innerHTML = "Open "+listName;
    openBtn.classList = "popupBtn";
    openBtn.onmouseup = function(){if(popupWhenClick){list(id.split("-")[1]);}};
    popup.appendChild(openBtn);

    //Create a button for deleting the list
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete "+listName;
    deleteBtn.classList = "popupBtn";
    deleteBtn.onmouseup = function(){if(popupWhenClick){delList(id.split("-")[1]);}};
    popup.appendChild(deleteBtn);
}

//A function for changing the name of lists/items
function changeObjectName(id) {
    //Get element by its provided id
    let input = document.getElementById(id);

    //Check if the name is empty, and if so change it
    if (input.value == "") {
        input.value = "unnamed";
    }

    //Check for the type of input and change behaviour accordingly
    if (input.className.split(" ").includes("listName")) {
        //Fetch the correct API endpoint with provided and stored params
        let fd = new FormData;
        fd.append("email",localStorage.getItem("listitEmail"));
        fd.append("password",localStorage.getItem("listitPassword"));
        fd.append("listid",id.split("-")[1]);
        fd.append("name",input.value);
        
        fetch("API/editlist",{
            method:"POST",
            body:fd
        })
        
        //If valid continue
        .then(response=>{
            if (response.status == 200) {
                return response.json();
            }
        })
        
        .then(data=>{
            //Send result to console
            console.log(data.message);
            //Check if change was successful, otherwise revert
            if (!data.result) {
                getPrevName(input);
            }
        })

    } else if (input.className.split(" ").includes("itemName")) {
        //Fetch the correct API endpoint with provided and stored params
        let fd = new FormData;
        fd.append("email",localStorage.getItem("listitEmail"));
        fd.append("password",localStorage.getItem("listitPassword"));
        fd.append("itemid",id.split("-")[1]);
        fd.append("name",input.value);
        
        fetch("API/edititem",{
            method:"POST",
            body:fd
        })
        
        //If valid continue
        .then(response=>{
            if (response.status == 200) {
                return response.json();
            }
        })
        
        .then(data=>{
            //Send result to console
            console.log(data.message);
            //Check if change was successful, otherwise return
            if (!data.result) {
                getPrevName(input);
            }
        })
    }
}

//A function for adding a new list
function addList() {
    //Fetch the correct API endpoint using stored params
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("name",document.getElementById("addInput").value);

    fetch("API/addlist",{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        //Send result to console
        console.log(data.message);
        //Check if operation was successful
        if (data.result) {
            //Create a list element
            buildList(data.id,document.getElementById("addInput").value);
            document.getElementById("addInput").value = "";
        }
    })
}

//A function for deleting a list
function delList(id) {
    //Fetch the correct API endpoint using provided and stored params
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("listid",id);

    fetch("API/dellist",{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        //Send result to console
        console.log(data.message);
        //Check if operation was successful
        if (data.result) {
            //Remove element
            resetManagers();
            deletePopup();
            document.getElementById("list-"+id).remove();
        }
    })
}

//A function for fetching the items of a list
function list(id) {
    //Set the target destination to the provided list
    sessionStorage.setItem("targetList",id);
    //Delete popup and remove other page elements
    deletePopup();
    removeRemovable();

    //Fetch the lists content using provided and stored params
    fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("listid",id);
    
    fetch("API/list",{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        //Check if operation was successful
        if (data.result) {
            //Create a title for the specified list
            let listTitle = document.createElement("div");
            listTitle.innerHTML = data.name;
            listTitle.id = "listTitle";
            listTitle.classList = "removable";
            wrapper.appendChild(listTitle);

            //Create a button for returning to the overview-page
            let backBtn = document.createElement("div");
            backBtn.innerHTML = "Back To Lists";
            backBtn.onclick = function(){lists();};
            backBtn.classList = "removable backBtn";
            wrapper.appendChild(backBtn);

            //Create a list of all items within the list
            let items = data.items;

            //Create a bar with a input and a button for creating new items
            let addBar = document.createElement("div");
            addBar.id = "addBar";
            addBar.classList = "removable";
            wrapper.appendChild(addBar);

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

            //Create parent divs for storing complete and incomplete items separately
            let incomplete = document.createElement("div");
            incomplete.classList = "removable itemdiv";
            incomplete.id = "incomplete";
            document.body.appendChild(incomplete);
            let complete = document.createElement("div");
            complete.classList = "removable itemdiv";
            complete.id = "complete";
            document.body.appendChild(complete);

            //Iterate over all items in list
            for (let item in items) {
                buildItem(items[item].id,items[item].name,items[item].status,items[item].amount);
            }

        } else {
            //Send result to console
            console.log(data.message);
        }
    })
}

//A function for creating a new item
function addItem(listid) {
    //Fetch to the correct API endpoint using provided and stored params
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("name",document.getElementById("addInput").value);
    fd.append("listid",listid);

    fetch("API/additem",{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        //Send result to console
        console.log(data.message);
        //If operation successful
        if (data.result) {
            //Create new item using provided params
            buildItem(data.id,document.getElementById("addInput").value,0,1);
            document.getElementById("addInput").value = "";
        }
    })
}

//A function for deleting an item
function delItem(id) {
    //Fetch to the correct API endpoint using provided and stored params
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("itemid",id);

    fetch("API/delitem",{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        //Send result to console
        console.log(data.message);
        //If operation successful
        if (data.result) {
            //Remove item
            resetManagers();
            deletePopup();
            document.getElementById("item-"+id).remove();
        }
    })
}

//A function for deleting all completed elements of a list
function deleteAll() {
    //Fetch to the correct API endpoint using stored params
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("listid",sessionStorage.getItem("targetList"));

    fetch("API/deleteall",{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        //Send result to console
        console.log(data.message);
        //Check if operation successful
        if (data.result) {
            //Reload page
            pickPage();
        }
    })
}

//A function for creating a popup for item settings
function itemPopup(id) {
    //Get name of provided element id
    itemName = document.getElementById("inameBox-"+id.split("-")[1]).value;
    
    //Create a popup and popup background
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

    //Create a title for the popup
    let title = document.createElement("p");
    title.innerHTML = "Item Options";
    popup.appendChild(title);

    //Get the checkbox of the current item
    let checkBox = document.getElementById("checkBox-"+id.split("-")[1]);

    //Create a button for completing/restoring the element
    let completeBtn = document.createElement("button");
    completeBtn.classList = "popupBtn";
    completeBtn.onmouseup = function(){if(popupWhenClick){updateStatus(checkBox,false);}};
    popup.appendChild(completeBtn);

    //Create a button for completing all elements in the current list
    let completeallBtn = document.createElement("button");
    completeallBtn.classList = "popupBtn";
    completeallBtn.onmouseup = function(){if(popupWhenClick){updateStatusAll(checkBox);}};
    popup.appendChild(completeallBtn);

    //Create a button for deleting the current item
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete "+itemName;
    deleteBtn.classList = "popupBtn";
    deleteBtn.onmouseup = function(){if(popupWhenClick){delItem(id.split("-")[1]);}};
    popup.appendChild(deleteBtn);

    //Check if the checkbox is checked
    if (checkBox.checked) {
        //Add a "restore" text to the completebutton and completeallbuttons
        completeBtn.innerHTML = "Restore "+itemName;
        completeallBtn.innerHTML = "Restore All";

        //Create a button for deleting all completed items in the current list
        let deleteallBtn = document.createElement("button");
        deleteallBtn.classList = "popupBtn";
        deleteallBtn.innerHTML = "Delete All";
        deleteallBtn.onmouseup = function(){if(popupWhenClick){deleteAll();}};
        popup.appendChild(deleteallBtn);

    } else {
        //Add a "complete" text to completebutton and completeallbutton
        completeBtn.innerHTML = "Complete "+itemName;
        completeallBtn.innerHTML = "Complete All";
    }
}

//A function for editing the amount of an item
function editItemX(id) {
    //Get the amount-box by id
    let input = document.getElementById(id);

    //Check if the amount is set correctly and change accordingly
    if (input.value == "") {
        input.value = 1;

    } else if (input.value < 1) {
        input.value = 1;

    } else if (input.value.length > 9) {
        input.value = 999999999;
    }

    //Fetch to the correct API endpoint using provided and stored params
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("itemid",id.split("-")[1]);
    fd.append("count",input.value);
    
    fetch("API/edititemx",{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        //Send result to the console
        console.log(data.message);
        //Check if operation was unsuccessful
        if (!data.result) {
            //Revert value to previous
            getPrevName(input);
        }
    })
}

//A function for fetching the previous value of a field
function getPrevName(input) {
    //Get the type of field dealt with
    let type = input.id.split("-")[0];

    //Change behaviour depending on the type
    if (type == "countBox" || type == "inameBox") {
        //Fetch to the correct endpoint using provided and stored params
        let fd = new FormData;
        fd.append("email",localStorage.getItem("listitEmail"));
        fd.append("password",localStorage.getItem("listitPassword"));
        fd.append("itemid",input.id.split("-")[1]);

        fetch("API/item",{
            method:"POST",
            body:fd
        })
        
        //If valid continue
        .then(response=>{
            if (response.status == 200) {
                return response.json();
            }
        })
        
        .then(data=>{
            //Send result to console
            console.log(data.message);
            //Check if operation was successful
            if (data.result) {
                //Apply the right type of value to the right type
                if (type == "countBox") {
                    input.value = data.amount;

                } else {
                    input.value = data.name;
                }
            }
        })

    } else if (type == "nameBox") {
        //Fetch to the correct API endpoint using provided and stored params
        let fd = new FormData;
        fd.append("email",localStorage.getItem("listitEmail"));
        fd.append("password",localStorage.getItem("listitPassword"));
        fd.append("listid",input.id.split("-")[1]);

        fetch("API/list",{
            method:"POST",
            body:fd
        })
        
        //If valid continue
        .then(response=>{
            if (response.status == 200) {
                return response.json();
            }
        })
        
        .then(data=>{
            //Send result to the console
            console.log(data.message);
            //Check if operation was successful
            if (data.result) {
                //Set the field value to the previous value
                input.value = data.name;
            }
        })
    }
}

//A function for updating the status of an item
function updateStatus(input,invert) {
    //Get the actual id of the object
    let id = input.parentElement.id.split("-")[1];

    //Create formdata for the fetch using provided and stored params
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("itemid",id);

    //Set the method to the status of the input (checkbox)
    let method = "complete";

    if (input.checked) {
        method = "restore";
    }

    //Pick the opposite method if invert is true
    if (invert) {
        if (method == "complete") {
            method = "restore";

        } else {
            method = "complete";
        }
    }

    let status = 0;
    if (method == "complete") {
        status = 1;
    }

    //Fetch to the correct API endpoint using the formdata
    fetch("API/"+method,{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        //Send result to the console
        console.log(data.message);
        //Check if operation was successful
        if (data.result) {
            //Replace the item
            buildItem(id,document.getElementById("inameBox-"+id).value,status,document.getElementById("countBox-"+id).value);
            input.parentElement.remove();
            deletePopup();
        }
    })
}

//A function for updating the status of all items in current list
function updateStatusAll(input) {
    //Create formdata for the fetch using stored params
    let fd = new FormData;
    fd.append("email",localStorage.getItem("listitEmail"));
    fd.append("password",localStorage.getItem("listitPassword"));
    fd.append("listid",sessionStorage.getItem("targetList"));

    //Set the method to the status of the input (checkbox)
    let method = "completeall";

    if (input.checked) {
        method = "restoreall";
    }

    //Fetch to the correct API endpoint using the formdata
    fetch("API/"+method,{
        method:"POST",
        body:fd
    })
    
    //If valid continue
    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })
    
    .then(data=>{
        //Send result to the console
        console.log(data.message);
        //Check if operation was successful
        if (data.result) {
            //Reload page
            pickPage();
        }
    })
}

//A function for building item elements
function buildItem(id,name,status,amount) {
    //Create new item
    let itemBuilder = document.createElement("div");
    itemBuilder.id = "item-"+id;
    
    //Add correct eventlisteners to the div depending on touch being enabled or not
    if (touchEnabled) {
        itemBuilder.ontouchstart = function(e){pressManager["item-"+id] = [e.touches[0].clientX,e.touches[0].clientY,e.touches[0].clientX,e.touches[0].clientY,Date.now()];};
        itemBuilder.ontouchmove = function(e){pressManager["item-"+id] = [pressManager["item-"+id][0],pressManager["item-"+id][1],e.touches[0].clientX,e.touches[0].clientY,Date.now()];};
        itemBuilder.ontouchend = function(){pressManager["item-"+id] = false;};

    } else {
        itemBuilder.onmousedown = function(e){pressManager["item-"+id] = [e.pageX,e.pageY,e.pageX,e.pageY,Date.now()]; mouseDown = true;};
    }

    //Check if item is completed or not and put the element in correct parent div
    if (status == true) {
        itemBuilder.classList = "removable item complete";
        document.getElementById("complete").appendChild(itemBuilder);

    } else {
        itemBuilder.classList = "removable item";
        document.getElementById("incomplete").appendChild(itemBuilder);
    }

    //Create a checkbox for completing/restoring the item
    let checkBuilder = document.createElement("input");
    checkBuilder.type = "checkbox";
    checkBuilder.id = "checkBox-"+id;
    checkBuilder.checked = status;
    checkBuilder.onclick = function(){updateStatus(checkBuilder,true);};
    itemBuilder.appendChild(checkBuilder);

    //Create a dynamic name-box for the item
    let nameBox = document.createElement("div");
    nameBox.classList = "iBMaj";
    itemBuilder.appendChild(nameBox);

    let nameBuilder = document.createElement("input");
    nameBuilder.classList = "itemName";
    nameBuilder.type = "text";
    nameBuilder.value = name;
    nameBuilder.id = "inameBox-"+id;
    nameBuilder.autocomplete = "off";
    textboxManager.push("inameBox-"+id);
    nameBuilder.onblur = function(){changeObjectName("inameBox-"+id);};
    nameBox.appendChild(nameBuilder);

    //Create a dynamic amount-box for the item
    let countBox = document.createElement("div");
    countBox.classList = "iBMin";
    countBox.innerHTML = "x";
    itemBuilder.appendChild(countBox);

    let countBuilder = document.createElement("input");
    countBuilder.classList = "itemName";
    countBuilder.type = "text";
    countBuilder.value = amount;
    countBuilder.id = "countBox-"+id;
    countBuilder.onblur = function(){editItemX("countBox-"+id);};
    textboxManager.push("countBox-"+id);
    countBox.append(countBuilder);
}

//A function for building list elements
function buildList(id,name) {
    //Create a div element to store list info
    let listBuilder = document.createElement("div");
    listBuilder.classList = "removable list";
    listBuilder.id = "list-"+id;
    
    //Check if mode is touchscreen and add appropriate event listeners
    if (touchEnabled) {
        listBuilder.ontouchstart = function(e){pressManager["list-"+id] = [e.touches[0].clientX,e.touches[0].clientY,e.touches[0].clientX,e.touches[0].clientY,Date.now()]; durations["list-"+id] = Date.now();};
        listBuilder.ontouchmove = function(e){pressManager["list-"+id] = [pressManager["list-"+id][0],pressManager["list-"+id][1],e.touches[0].clientX,e.touches[0].clientY,Date.now()];};
        listBuilder.ontouchend = function(){pressManager["list-"+id] = false;};

    } else {
        listBuilder.onmousedown = function(e){pressManager["list-"+id] = [e.pageX,e.pageY,e.pageX,e.pageY,Date.now()]; mouseDown = true; durations["list-"+id] = Date.now();};
    }

    wrapper.appendChild(listBuilder);

    //Create a dynamic editable name for the list div
    let nameBuilder = document.createElement("input");
    nameBuilder.classList = "listName";
    nameBuilder.type = "text";
    nameBuilder.value = name;
    nameBuilder.id = "nameBox-"+id;
    nameBuilder.autocomplete = "off";
    textboxManager.push("nameBox-"+id);
    nameBuilder.onclick = function(){durations = {};};
    nameBuilder.onblur = function(){changeObjectName("nameBox-"+id);};
    listBuilder.appendChild(nameBuilder);
}