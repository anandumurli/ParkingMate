lucide.createIcons();
const apiLink = "http://localhost:3000/api"

const loginPage = document.getElementById("loginPage");
const adminModule = document.getElementById("adminModule");
const marshalModule = document.getElementById("MarshalModule");
const CSRModule = document.getElementById("CSRView");
const CarParkGrid = document.getElementById("CarParkGrid");

const taostElement = document.getElementById("toast");
const toastClose = document.getElementById("toast-close");
const toastContent = document.getElementById("toast-content");

function closeToast(){
    toastContent.innerHTML = ""
    taostElement.classList.add('hide-toast')
}

const roleViewMap = new Map()
roleViewMap.set("admin", adminModule)
roleViewMap.set("marshal", marshalModule)
roleViewMap.set("csr", CSRModule)

const logout = document.getElementById("logout")

const marshalDrawerCheckbox = document.getElementById("drawer-chkbox")
const marshalLegendSubScreen = document.getElementById("marshal-legend")
const marshalEditSubScreen = document.getElementById("marshal-edit")


var currUserID = sessionStorage.getItem("userID")
var currUserRole = sessionStorage.getItem("role")
var currUserAccessToken = sessionStorage.getItem("accessToken")
var currUserRefreshToken = sessionStorage.getItem("refreshToken")


function toggleViewHidden(module, value){
    (value) ? module.classList.add('hiddenScreen') : module.classList.remove('hiddenScreen')
    // if hidden true, its out of view.
}

function mapRoleView(role) {
    return roleViewMap.get(role)
}

function setInitValues(user){
    currUserID = user.userID;
    currUserRole = user.role;
    currUserAccessToken = user.accessToken;
    currUserRefreshToken = user.refreshToken;

}
function showToast(msg){
    toastContent.innerText=msg
    taostElement.classList.remove('hide-toast')
}

function setCurrView(role){
    if (role){
        toggleViewHidden(loginPage, true);
        toggleViewHidden(adminModule, true);
        toggleViewHidden(marshalModule, true);
        toggleViewHidden(CSRModule, true);
        toggleViewHidden(CarParkGrid, true);
        toggleViewHidden(mapRoleView(role), false);

    } else {
        toggleViewHidden(loginPage, false);
        toggleViewHidden(adminModule, true);
        toggleViewHidden(marshalModule, true);
        toggleViewHidden(CSRModule, true);
        toggleViewHidden(CarParkGrid, true);
    }
}

document.getElementById('loginForm').addEventListener("submit", (e) => {
    e.preventDefault();
    closeToast();
    const username = document.getElementById('uname').value;
    const password = document.getElementById('pass').value;

    axios.post(apiLink+'/auth/login', {
        'uname': username,
        'pass': password
    }).then((resp) => {
        if(resp.data.user)
        {
            //clear all storage in session 
            sessionStorage.setItem("userID", resp.data.user.userID)
            sessionStorage.setItem("accessToken", resp.data.user.accessToken)
            sessionStorage.setItem("role", resp.data.user.role)
            if(resp.data.user.role === "admin" ){
                window.location.href = "./admin.html"
            }else{
                setCurrView(resp.data.user.role)
                setInitValues(resp.data.user)
            }
            


        }
        else{
            showToast(`${resp.data.message}`)
        }
        
    }).catch((err) => {
        console.log("err " + err)
    })

})

toastClose.addEventListener("click", (e)=>{

    e.preventDefault();
    closeToast();
})

//logout
logout.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.clear();
    setCurrView("");  
})

//auto login implementation
setCurrView(currUserRole)

function marshalDrawerOption(selectedOption){
    // populate screen with data here
    if(selectedOption && selectedOption == 1) {
        marshalDrawerCheckbox.checked = false
        if (marshalLegendSubScreen.classList.contains("hiddenScreen")) 
            {
                marshalLegendSubScreen.classList.remove("hiddenScreen")
            }
        marshalEditSubScreen.classList.add("hiddenScreen");
    }
    if(selectedOption && selectedOption == 2) {
        marshalDrawerCheckbox.checked = false;
        if (marshalEditSubScreen.classList.contains("hiddenScreen"))
        {
            marshalEditSubScreen.classList.remove("hiddenScreen")
        }
        marshalLegendSubScreen.classList.add("hiddenScreen");
    }
}



function sectionFormSubmit(formElementsArr){
    console.log(formElementsArr[0][0].value)
    console.log(formElementsArr[0][1].value)



    var l = (sessionStorage.getItem("sectionList")) ? sessionStorage.getItem("sectionList") : ''
    l = l + ';' + `${formElementsArr[0][0].value}:${formElementsArr[0][1].value}`
    sessionStorage.setItem("sectionList", l)
    document.getElementById("section_modal").removeAttribute("open")
    location.reload()
}

function openModal(modalName){
    if(modalName) document.getElementById(modalName).setAttribute("open", true)

}
function populateVanModal(){
    // get the values from session storage, store it as options for the select menu, open the modal
    const sectionList = sessionStorage.getItem("sectionList")
    if (!sectionList){
        showToast("Need to add sections, prior to adding a car.")
    }else{
        console.log(sectionList.split(";").filter(Boolean).map((el)=>{return el.split(":")[0]}))
        document.getElementById("van_modal").setAttribute("open", true)
    }
}

function vanFormSubmit(formElementsArr){
    

}




// admin will set section, as well as the number of cars in any section.
// i think we need another db thingy for a two of them one to determine the layout, second for mapping 
// map -- sectionName: , totalCarsPerSection:, numberOfCarsPerRow:, assignedTo:;
// layout -- routeNumber:, vinNumber:, checkinTime:, checkOutTime 