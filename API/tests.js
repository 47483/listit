var testurl = "localhost/listit/API/";

function fetchTest(subject,testInfo,formData,expectedResult) {
    formData.append("selftest",true);

    fetch(testurl+subject,{
        method:"POST",
        body:formData
    })

    .then(response=>{
        if (response.status == 200) {
            return response.json();
        }
    })

    .then(data=>{
        let table = document.getElementById(subject);
        let testResult = document.createElement("tr");
        let tdBuilder = document.createElement("td");
        tdBuilder.innerHTML = subject;
        testResult.appendChild(tdBuilder);

        tdBuilder = document.createElement("td");
        tdBuilder.innerHTML = testInfo;
        testResult.appendChild(tdBuilder);

        tdBuilder = document.createElement("td");
        if (expectedResult == true) {
            tdBuilder.innerHTML = "EXPECTED SUCCESS";

        } else {
            tdBuilder.innerHTML = "EXPECTED FAIL";
        }
        testResult.appendChild(tdBuilder);

        tdBuilder = document.createElement("td");
        if (data.result) {
            tdBuilder.innerHTML = "GOT SUCCESS";

        } else {
            tdBuilder.innerHTML = "GOT FAIL";
        }
        testResult.appendChild(tdBuilder);

        if (data.result == expectedResult) {
            testResult.classList = "succeeded";

        } else {
            testResult.classList = "failed";
        }

        tdBuilder = document.createElement("td");
        tdBuilder.innerHTML = data.message;
        testResult.appendChild(tdBuilder);

        table.appendChild(testResult);
    })
}

function testUserfunctions() {
    let title = document.createElement("h3");
    title.innerHTML = "User Functions";
    document.body.appendChild(title);

    let login = document.createElement("table");
    login.id = "login";
    document.body.appendChild(login);

    let signup = document.createElement("table");
    signup.id = "signup";
    document.body.appendChild(signup);

    //Login
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("login","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fetchTest("login","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fetchTest("login","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("password","test");
    fetchTest("login","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fetchTest("login","Missing password.",fd,false);

    //Signup
    fd = new FormData();
    fd.append("email","newtest@test.test");
    fd.append("password","test");
    fetchTest("signup","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrong");
    fd.append("password","test");
    fetchTest("signup","Using invalid email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("signup","Using existing email.",fd,false);

    fd = new FormData();
    fd.append("password","test");
    fetchTest("signup","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","newtest@test.test");
    fetchTest("signup","Missing password.",fd,false);
}

function testListfunctions() {
    let title = document.createElement("h3");
    title.innerHTML = "List Functions";
    document.body.appendChild(title);

    let lists = document.createElement("table");
    lists.id = "lists";
    document.body.appendChild(lists);

    let list = document.createElement("table");
    list.id = "list";
    document.body.appendChild(list);

    let addlist = document.createElement("table");
    addlist.id = "addlist";
    document.body.appendChild(addlist);

    let editlist = document.createElement("table");
    editlist.id = "editlist";
    document.body.appendChild(editlist);

    let dellist = document.createElement("table");
    dellist.id = "dellist";
    document.body.appendChild(dellist);

    //lists
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("lists","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fetchTest("lists","Using wrong mail.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fetchTest("lists","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("password","test");
    fetchTest("lists","Missing mail.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fetchTest("lists","Missing password.",fd,false);

    //list
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("list","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("list","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("listid",1);
    fetchTest("list","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",-1);
    fetchTest("list","Using invalid listid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("list","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("listid",1);
    fetchTest("list","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("list","Missing listid.",fd,false);

    //addlist
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("name","newtest");
    fetchTest("addlist","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("name","newtest");
    fetchTest("addlist","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("name","newtest");
    fetchTest("addlist","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("password","test");
    fd.append("name","newtest");
    fetchTest("addlist","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("name","newtest");
    fetchTest("addlist","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("addlist","Missing name.",fd,false);

    //editlist
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fd.append("name","newtest");
    fetchTest("editlist","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fd.append("name","newtest");
    fetchTest("editlist","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("listid",1);
    fd.append("name","newtest");
    fetchTest("editlist","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",-1);
    fd.append("name","newtest");
    fetchTest("editlist","Using invalid listid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("password","test");
    fd.append("listid",1);
    fd.append("name","newtest");
    fetchTest("editlist","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("listid",1);
    fd.append("name","newtest");
    fetchTest("editlist","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("name","newtest");
    fetchTest("editlist","Missing listid.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("editlist","Missing name.",fd,false);

    //dellist
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("dellist","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("dellist","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("listid",1);
    fetchTest("dellist","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",-1);
    fetchTest("dellist","Using invalid listid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("dellist","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("listid",1);
    fetchTest("dellist","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("dellist","Missing listid.",fd,false);
}

function testItemfunctions() {
    let title = document.createElement("h3");
    title.innerHTML = "Item Functions";
    document.body.appendChild(title);

    let additem = document.createElement("table");
    additem.id = "additem";
    document.body.appendChild(additem);

    let edititem = document.createElement("table");
    edititem.id = "edititem";
    document.body.appendChild(edititem);

    let edititemx = document.createElement("table");
    edititemx.id = "edititemx";
    document.body.appendChild(edititemx);

    let delitem = document.createElement("table");
    delitem.id = "delitem";
    document.body.appendChild(delitem);

    let deleteall = document.createElement("table");
    deleteall.id = "deleteall";
    document.body.appendChild(deleteall);

    let complete = document.createElement("table");
    complete.id = "complete";
    document.body.appendChild(complete);

    let completeall = document.createElement("table");
    completeall.id = "completeall";
    document.body.appendChild(completeall);

    let restore = document.createElement("table");
    restore.id = "restore";
    document.body.appendChild(restore);

    let restoreall = document.createElement("table");
    restoreall.id = "restoreall";
    document.body.appendChild(restoreall);

    //additem
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fd.append("name","test");
    fetchTest("additem","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fd.append("name","test");
    fetchTest("additem","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("listid",1);
    fd.append("name","test");
    fetchTest("additem","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",-1);
    fd.append("name","test");
    fetchTest("additem","Using invalid listid.",fd,false);

    fd = new FormData();
    fd.append("password","test");
    fd.append("listid",1);
    fd.append("name","test");
    fetchTest("additem","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("listid",1);
    fd.append("name","test");
    fetchTest("additem","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("name","test");
    fetchTest("additem","Missing listid.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("additem","Missing name.",fd,false);

    //edititem
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fd.append("name","newtest");
    fetchTest("edititem","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fd.append("name","newtest");
    fetchTest("edititem","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("itemid",1);
    fd.append("name","newtest");
    fetchTest("edititem","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",-1);
    fd.append("name","newtest");
    fetchTest("edititem","Using invalid itemid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("password","test");
    fd.append("itemid",1);
    fd.append("name","newtest");
    fetchTest("edititem","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("itemid",1);
    fd.append("name","newtest");
    fetchTest("edititem","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("name","newtest");
    fetchTest("edititem","Missing itemid.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("edititem","Missing name.",fd,false);

    //edititemx
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fd.append("count",1);
    fetchTest("edititemx","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fd.append("count",1);
    fetchTest("edititemx","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("itemid",1);
    fd.append("count",1);
    fetchTest("edititemx","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",-1);
    fd.append("count",1);
    fetchTest("edititemx","Using invalid itemid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fd.append("count",-1);
    fetchTest("edititemx","Using invalid count.",fd,false);

    fd = new FormData();
    fd.append("password","test");
    fd.append("itemid",1);
    fd.append("count",1);
    fetchTest("edititemx","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("itemid",1);
    fd.append("count",1);
    fetchTest("edititemx","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("count",1);
    fetchTest("edititemx","Missing itemid.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("edititemx","Missing count.",fd,false);

    //delitem
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("delitem","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("delitem","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("itemid",1);
    fetchTest("delitem","Using wrong password.",fd,false);
    
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",-1);
    fetchTest("delitem","Using invalid itemid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("delitem","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("itemid",1);
    fetchTest("delitem","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("delitem","Missing itemid.",fd,false);

    //deleteall
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("deleteall","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("deleteall","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("listid",1);
    fetchTest("deleteall","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",-1);
    fetchTest("deleteall","Using invalid listid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("deleteall","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("listid",1);
    fetchTest("deleteall","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("deleteall","Missing listid.",fd,false);

    //complete
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("complete","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("complete","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("itemid",1);
    fetchTest("complete","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("complete","Using invalid itemid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("complete","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("itemid",1);
    fetchTest("complete","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("complete","Missing itemid.",fd,false);

    //completeall
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("completeall","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("completeall","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("listid",1);
    fetchTest("completeall","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("completeall","Using invalid itemid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("completeall","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("listid",1);
    fetchTest("completeall","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("completeall","Missing listid.",fd,false);

    //restore
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("restore","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("restore","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("itemid",1);
    fetchTest("restore","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("restore","Using invalid itemid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("password","test");
    fd.append("itemid",1);
    fetchTest("restore","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("itemid",1);
    fetchTest("restore","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("restore","Missing itemid.",fd,false);

    //restoreall
    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("restoreall","Using all correct params.",fd,true);

    fd = new FormData();
    fd.append("email","wrongtest@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("restoreall","Using wrong email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","wrongtest");
    fd.append("listid",1);
    fetchTest("restoreall","Using wrong password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("restoreall","Using invalid itemid. (Returns Empty)",fd,true);

    fd = new FormData();
    fd.append("password","test");
    fd.append("listid",1);
    fetchTest("restoreall","Missing email.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("listid",1);
    fetchTest("restoreall","Missing password.",fd,false);

    fd = new FormData();
    fd.append("email","test@test.test");
    fd.append("password","test");
    fetchTest("restoreall","Missing listid.",fd,false);
}

testUserfunctions();
testListfunctions();
testItemfunctions();