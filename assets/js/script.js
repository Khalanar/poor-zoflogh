let gameMessages = [
    "Oh no... an alien has crashed into Planet Earth.<br><br> Poor Zoflogh.",
]

let buildingDescriptions = {
    ship: "Zoflogh's crashed ship.<br><br>Luckily some parts can be salvaged with some inventive and spare time.<br><br>You may need to access earthen materials to get out of there, build your way out of this planet.",
    generator: "Solar Powered generator<br><br>Salvaged off some spare parts of Zoflogh's ship, this generator transforms photons emitted by the closest star into energy.<br><br>Can be upgraded for better energy output",
    nursery: "Nursery and Incubator<br><br>Froongkians edited their genome for asexual reproduction, leisurly sex is however encouraged as a bonding exercise<br><br>Use DNA to lay eggs, and energy to incubate them.",
    printer: "A recycler and 3D printer by Uglog Industries.<br><br>Insert any type of matter to be recycled into metamaterial, the only material used in planet Froongk. For walls and electronics to clothing, it is incredibly poisonous, do not ingest.",
    biopsy_room:"Biopsy room<br><br>Start abduction missions to collect DNA samples from creatures around the planet.<br><br>Froongkian laws strongly advise against bonding with abductees, however it's not forbidden.",
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
    document.getElementById("building-description").innerHTML = buildingDescriptions[b.id]
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