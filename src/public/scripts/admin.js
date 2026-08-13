lucide.createIcons();
const apiLink = "http://localhost:3000/api"

const taostElement = document.getElementById("toast");
const toastClose = document.getElementById("toast-close");
const toastContent = document.getElementById("toast-content");
const accessToken = sessionStorage.getItem("accessToken");

const header = { headers: { authorization: `Bearer ${accessToken}`}}

let localUsersList = []

function closeToast(){
    toastContent.innerHTML = ""
    taostElement.classList.add('hide-toast')
}
function showToast(msg){
    toastContent.innerText=msg
    taostElement.classList.remove('hide-toast')
}

toastClose.addEventListener("click" , (e) => {
    e.preventDefault();
    closeToast();
})

var currUserID = sessionStorage.getItem("userID")
var currUserRole = sessionStorage.getItem("role")
var currUserAccessToken = sessionStorage.getItem("accessToken")
var currUserRefreshToken = sessionStorage.getItem("refreshToken")

const adminSidebarChkbox = document.getElementById("drawer-chkbox")

const adminEditSubScreen = document.getElementById("admin-edit")
const adminUploadSubScreen = document.getElementById("admin-upload")

const subScreens = [adminEditSubScreen, adminUploadSubScreen]

if (!currUserRole){
    window.location.href = "./index.html"
}

const logout = document.getElementById("logout")
logout.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.clear();
    window.location.href = "./index.html"
})


function adminDrawerOption(selectedOption){
    // populating screens?
    if(selectedOption > subScreens.length){
        window.location.href = "./grid.html"
    }else{
        subScreens.forEach((val, indx) => {
                adminSidebarChkbox.checked = false
                if(!val.classList.contains("hiddenScreen")) { val.classList.add("hiddenScreen") }
                if(selectedOption === indx){
                    val.classList.remove("hiddenScreen")
                }
            })
    }
}

document.getElementById('setWaves').addEventListener("submit", (e)=>{
    e.preventDefault();

    let details ={date: new Date().toISOString(), 'nWaves': document.getElementById('noOfWaves').value} 

    axios.post(apiLink+'/dispatch/setNWaves',details, header).then((resp)=>{
        showToast(`${resp.data.message}`)
        document.getElementById('setWaves').reset()
    })
})

document.getElementById('newUser').addEventListener("submit", (e)=>{
    e.preventDefault();
    
    const username = document.getElementById("uname").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const details = {
        'uname': username,
        'pass': password,
        'role': role,
        'isActive': true
    }

    axios.post(apiLink+'/users/newUser', details, header).then((resp)=>{
        showToast(`${resp.data.message}`)
        document.getElementById('newUser').reset()
        userTableRefresh()
    })

})
function userTableRefresh(e) {
    if(e){
        e.preventDefault();
    }
    axios.get(apiLink+'/users/allUsers', header).then((resp)=>{
        localUsersList = resp.data.users;
        renderTable(localUsersList);

    })
}
function renderTable(users){
    const tbody = document.getElementById("userTable");
    tbody.innerHTML = ""
    users.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML=`
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${user.isActive ? "Active" : "Inactive" }</td>
            <td>
                <a onclick="editUserOpenModal('${user._id}')" class="link link-info">Edit</a>
            </td>
            <td>
                <a onclick="deleteUser('${user._id}'
                )" class="link link-accent">Delete</a>
            </td>
        `
        tbody.appendChild(tr);
    })
}

document.getElementById("userRefresh").addEventListener("click", e => userTableRefresh(e))



function editUserOpenModal(userID){
    const currUser = localUsersList.find((u) => u._id === userID)
    
    document.getElementById("userEditModal").setAttribute("open", true);
    document.getElementById("modalHeading").textContent = `Edit User ${currUser.username}`


    populateUserForm(currUser)

}

function editUserCloseModal(){
    document.getElementById("userEditModal").removeAttribute("open")
}

function populateUserForm(currUserData){
    document.getElementById("editRole").value = currUserData.role
    document.getElementById("editStatus").value = currUserData.isActive
    document.getElementById("editPermissionsUsers").checked = currUserData.canManageUsers
    document.getElementById("editPermissionsRouteMani").checked = currUserData.canUploadRouteManifest
    document.getElementById("editPermissionsDriverMani").checked = currUserData.canUploadDriverManifest
    document.getElementById("editPermissionsWaves").checked = currUserData.canAddRemoveWaves
    document.getElementById("editPermissionsReports").checked = currUserData.canDownloadReports
    document.getElementById("userID").value = currUserData._id
}

document.getElementById("editUser").addEventListener("submit", (e)=>{
    e.preventDefault();
    const editPassword = document.getElementById("editPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const match = editPassword.value === confirmPassword.value;
    // confirmPassword.setCustomValidity(match ? "" : "Passwords do not match");
    document.getElementById("passwordError").classList.toggle("hidden", match);

    if(match){
        const formData = {
            'password': document.getElementById("editPassword").value,
            'role': document.getElementById("editRole").value,
            'isActive': document.getElementById("editStatus").value,
            'permissions': {
                'canManageUsers': document.getElementById("editPermissionsUsers").checked,
                'canUploadRouteManifest': document.getElementById("editPermissionsRouteMani").checked,
                'canUploadDriverManifest': document.getElementById("editPermissionsDriverMani").checked,
                'canAddRemoveWaves' : document.getElementById("editPermissionsWaves").checked,
                'canDownloadReports': document.getElementById("editPermissionsReports").checked
            }
        }
        if (formData.password.trim() === "") {
            delete formData.password;
        }
        //need to send the curUserID, dont have it, need to something about it
        let userID = document.getElementById("userID").value

        axios.put(apiLink+`/users/updateUser/${userID}`, formData, header).then((resp)=>{
                showToast(`${resp.data.message}`)
                userTableRefresh()
                document.getElementById("editUser").reset()
            })

        editUserCloseModal()
    }
   
})


function deleteUser(userID) {
    axios.delete(apiLink+`/users/deleteUser/${userID}`, header).then((resp)=>{
            showToast(`${resp.data.message}`)
            document.getElementById('newUser').reset()
            userTableRefresh()
        })
    userTableRefresh();
}