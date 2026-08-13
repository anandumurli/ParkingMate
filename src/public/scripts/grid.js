// set up persisten wave details using that today cars, 
// need to have to empty the form as well


//struggling with undefined, wace setting. fix first then work on persisrtenc
lucide.createIcons();
const apiLink = "http://localhost:3000/api"

const taostElement = document.getElementById("toast");
const toastClose = document.getElementById("toast-close");
const toastContent = document.getElementById("toast-content");
const accessToken = sessionStorage.getItem("accessToken");

const header = { headers: { authorization: `Bearer ${accessToken}`}}
let todayCars = [];
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
sessionStorage.setItem("currentWave", '1')

const editCarModal = document.getElementById("editCarModal")



if (!currUserRole){
    window.location.href = "./index.html"
}

const logout = document.getElementById("logout")
logout.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.clear();
    window.location.href = "./index.html"
})

const SidebarChkbox = document.getElementById("drawer-chkbox")

const gridSubScreen = document.getElementById("grid")
const optionalUploadSubScreen = document.getElementById("optional-update")

let subScreens = [gridSubScreen]
//'admin', 'csr', 'marshal', 'supervisor'
const checkinConstraintUploadPage = ['admin', 'supervisor']
const checkinConstraintCanCallAudits = ['admin', 'supervisor', 'csr']
const checkinConstraintCanViewConsole = ['admin']
if(checkinConstraintUploadPage.includes(currUserRole)){
    renderMenu(0); //0=>upload; 1=>console
    subScreens.push(optionalUploadSubScreen)
}
if(checkinConstraintCanViewConsole.includes(currUserRole)){
    renderMenu(1);
}

function renderMenu(value){
    const menu = document.getElementById("menu");
    const li = document.createElement("li")
    li.classList.add("my-2")
    if(value == 0){
        li.innerHTML = `
            <div class="divider"></div>
            <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Upload Documents" onclick="drawerOption(1)">
                <i data-lucide="file-plus-corner" class="size-4"></i>
                <span class="is-drawer-close:hidden">Upload Documents</span>
            </button>

        `
    }else if(value == 1){
        li.innerHTML = `
            <div class="divider"></div>
            <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Get to Admin Portal" onclick="drawerOption(999)">
                <i data-lucide="shield-ellipsis" class="size-4"></i>
                <span class="is-drawer-close:hidden">View Portal</span>
            </button>
        `
    }
    menu.appendChild(li);
    lucide.createIcons();
}

function drawerOption(selectedOption){
    if(selectedOption > subScreens.length){
        window.location.href = "./admin.html"
    }else{
        subScreens.forEach((val, indx) => {
                SidebarChkbox.checked = false
                if(!val.classList.contains("hiddenScreen")) { val.classList.add("hiddenScreen") }
                if(selectedOption === indx){
                    val.classList.remove("hiddenScreen")
                }
            })
    }
    
}
//rendering the number of waves
function getNumberOfWaves(){
    axios.get(apiLink+'/dispatch/getNWaves',header).then((resp)=>{
            if(resp.data.message){
                renderWaveMenu(parseInt(resp.data.message.numberOfWaves))
            }else{
                showToast("Number of waves not set, please ask Admin to do the same.")
            }
        })
}


function renderWaveMenu(numberOfWaves){
    const menu = document.getElementById("wave-menu")
    menu.innerHTML=""
    for(let i = 1; i <= numberOfWaves; i++){
        const li = document.createElement("li");
        li.innerHTML = `<a onclick="buildGrid(${i})"> Wave ${i}</a>`
        menu.appendChild(li)
    }
}

autoPopulateCars(sessionStorage.getItem('currentWave'))

var cols_r = [3,2,1], cols_l = [5,4], all_cols = [5,4,3,2,1], rows = ['E','D','C','B','A']
var state={cells:{},qrMap:{}};
var dispatchData={};

//maybe should store wave here as well so that have some hold on that
//or, maybe should have it stored in the db instead

function buildGrid(waveNumber){
    
    const containerTable = document.getElementById("grid-layout");
    containerTable.innerHTML = '';
    rows.forEach(function(row){
        var tr=document.createElement('tr');
        cols_l.forEach(function(col){tr.appendChild(makeCellTd(row,col));});
        var d=document.createElement('td');d.className='divider-td';d.setAttribute('aria-hidden','true');tr.appendChild(d);
        cols_r.forEach(function(col){tr.appendChild(makeCellTd(row,col));});
            containerTable.appendChild(tr);
    });
    if(waveNumber){
        sessionStorage.setItem("currentWave", waveNumber)
        autoPopulateCars(waveNumber)
    }
}

function makeCellTd(row,col){
 var id=row+col;state.cells[id]='';
 var td=document.createElement('td');
 var cw=document.createElement('div');cw.className='cell-wrap';
 var lb=document.createElement('span');lb.className='cell-label';lb.textContent=id;
 var divInp=document.createElement('div');
 divInp.id='c-'+id;divInp.className='cell-input';
 divInp.autocomplete='off';
 divInp.setAttribute('aria-label','Cell '+id);
 divInp.addEventListener('click',()=>{commitCell(id)});
 var divCon = document.createElement('span'); divCon.className='cell-con';divCon.id=`span-${id}`
 divInp.appendChild(divCon);
 cw.appendChild(lb);cw.appendChild(divInp);td.appendChild(cw);return td;
 autoPopulateCars(sessionStorage.getItem('currentWave'))
}


function commitCell(id){
    console.log(sessionStorage.getItem("currentWave") !== undefined)
    if(sessionStorage.getItem("currentWave") === "undefined" || undefined){
        showToast("Wave Not Set")
       
    }else{
        console.log(id)
        populateCarModal(id)
        editCarModal.setAttribute("open", true);
    }
}

function refreshGridPage(){
    getNumberOfWaves();
    buildGrid();
    //all the other functions that get called at start of the page
}

refreshGridPage()

function editCarCloseModal(){
    document.getElementById("editParking").reset();
    editCarModal.removeAttribute("open")
}

function populateCarModal(values){
    document.getElementById("editCarModalHeading").textContent = values
    document.getElementById("posID").value = values
    const currentWave = sessionStorage.getItem('currentWave')
    console.log(currentWave)
    let currentCar = todayCars.find((val) => 
        { 
            if(val.wave == currentWave && val.position == values) 
                return true
        })
    if(currentCar){
        document.getElementById("editCarModalHeading").textContent = values + ' - ' + currentCar.routeNo
        document.getElementById("editDriverID").value = currentCar.driverID
        document.getElementById("editVin").value = currentCar.vinNo
        document.getElementById("editLicense").value = currentCar.licenseNo
        document.getElementById("editRoute").value = currentCar.routeNo
    }
    

}

document.getElementById("editParking").addEventListener("submit", (e)=> {
    // get the values and store
    e.preventDefault();

    var wave = sessionStorage.getItem("currentWave")
    var driverID = document.getElementById("editDriverID").value
    var vinNo = document.getElementById("editVin").value
    var licenseNo = document.getElementById("editLicense").value
    var routeNo = document.getElementById("editRoute").value
    var position = document.getElementById("posID").value

    const data = {
        "wave": wave,
        "driverID": driverID,
        "vinNo": vinNo,
        "licenseNo": licenseNo,
        "routeNo": routeNo,
        "position": position
    }
    axios.post(apiLink+'/editCar/cars', data, header).then((resp) => {
        if(resp.data.car){
            todayCars.push(resp.data.car)
            document.getElementById(`span-${resp.data.car.position}`).textContent = resp.data.car.routeNo;
            document.getElementById("editParking").reset()
            editCarCloseModal(); 

        }else{
            showToast(resp.message)
        }
    })
    console.log(data)
})

function auditStatusToggled(event){
    // disable while the thingy is sending api request or socket request
    console.log(event.target.checked +  ' ' + document.getElementById("posID").value + ' ' + 'w'+sessionStorage.getItem("currentWave"))
    
}

//persistance
async function autoPopulateCars(wave){
    todayCars = [];
    await axios.get(apiLink+"/editCar/cars", header).then((resp)=>{
        resp.data.message.forEach(car => {todayCars.push(car)})
    })
    if(wave){
        //want to populate for a particular wave
        todayCars.forEach((car) => {
            if(car.wave == sessionStorage.getItem("currentWave")) {
                document.getElementById(`span-${car.position}`).textContent = car.routeNo
            }
        })
    }
}

// seems to be working, check all data being sent.
// auto populating form
// fill up the form, use some set of values for that
// open other parts of the form
// finish forms. check if socket can be done.