let gameMessages = [
    "Oh no... an alien has crashed into Planet Earth.<br><br> Poor Zoflogh.",
]

let buildingDescriptions = {
    ship: "this is a supership",
    generator: "this is a generator",
    nursery: "this is a nursery",
    printer: "this is a printer",
    biopsy_room:"this is a supership",
}


document.addEventListener("DOMContentLoaded", start())

function getBuildings(){
    let buildings = document.getElementsByClassName("building");
    
    for (let building of buildings){
        building.addEventListener("click", function(){
            clickBuilding(building)
        })
        console.log(`${building.id} initialised`);
    }
}

function clickBuilding(b){
    console.log("clicked " + b.id)
    showBuildingDescription(b)
}

function showBuildingDescription(b){
    document.getElementById("building-description").innerText = buildingDescriptions[b.id]
}

function updateGameLog(message){
    let msgLog = document.getElementById("game-log").innerHTML
    for (let msg of gameMessages){
        msgLog += `
        <p>${msg}</p><hr>
        `
    }
    document.getElementById("game-log").innerHTML = msgLog
}

function start(){
    console.log("start")
    updateGameLog("beep")
    getBuildings()
}

function update(){
    console.log("update")
}