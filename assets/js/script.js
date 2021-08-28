let gameMessages = [
    "Oh no... an alien has crashed into Planet Earth.<br><br> Poor Zoflogh.",
]

let buildingDescriptions = {
    ship: "Zoflogh's crashed ship.<br><br>Luckily some parts can be salvaged with some inventive and spare time.<br><br>You may need to access earthen materials to get out of here, build your way out of this planet.",
    generator: "Solar Powered Generator.<br><br>Salvaged off some spare parts of Zoflogh's ship, this generator transforms photons emitted by the closest star into energy.<br><br>Can be upgraded for better energy output",
    nursery: "Nursery and Incubator.<br><br>Froongkians edited their genome for asexual reproduction, leisurly sex is however encouraged as a bonding exercise.<br><br>Use DNA to lay eggs, and energy to incubate them.",
    printer: "A Recycler and 3D Printer by Uglog Industries.<br><br>Insert any type of matter to be recycled into metamaterial, the only material used in planet Froongk. For walls and electronics to clothing, it is incredibly poisonous, do not ingest.",
    biopsy_room:"Biopsy Room.<br><br>Start abduction missions to collect DNA samples from creatures around the planet.<br><br>Froongkian laws strongly advise against bonding with abductees, however it's not forbidden.",
}

let resources = {
    energy: 100,
    metamaterials: 100,
    dna: 0,
}

document.addEventListener("DOMContentLoaded", start())



function resourceRefresh(){
    document.getElementById("energy").innerText = resources.energy
    document.getElementById("metamaterials").innerText = resources.metamaterials
    document.getElementById("dna").innerText = resources.dna
    console.log("Refreshed resources card")
}

class Building{
    constructor(name, level, upgradeRequirements){
        this.name = name;
        this.level = level;
        this.maxLevel = 5;
        this.upgradeRequirements = upgradeRequirements;
    }

    upgrade(){
        if (this.level < this.maxLevel){
            let enoughEnergy = this.upgradeRequirements[this.level].energy <= resources.energy
            let enoughMetamaterials = this.upgradeRequirements[this.level].metamaterials <= resources.metamaterials
            let enoughDna = this.upgradeRequirements[this.level].dna <= resources.dna
            let enoughResources = enoughEnergy && enoughMetamaterials && enoughDna
            if (enoughResources){
                this.level++;
                console.log("Upgraded this building to " + this.level)
            }else{
                let msg = `Not enough resources to upgrade the ${this.name}, poor Zoflogh`
                // gameMessages.unshift(msg)
                updateGameLog(msg)
            }
        }
    }

    showRequirementsTable(){
        //change color if enough materials
        let reqTable = `
        <table>
            <tr>
                <td>${Object.keys(this.upgradeRequirements[this.level])[0]}</td>
                <td>${this.upgradeRequirements[this.level].energy}</td>
            </tr>
            <tr>
                <td>metamat.</td>
                <td>${this.upgradeRequirements[this.level].metamaterials}</td>
            </tr>
            <tr>
                <td>${Object.keys(this.upgradeRequirements[this.level])[2]}</td>
                <td>${this.upgradeRequirements[this.level].dna}</td>
            </tr>
        </table>
        `
        return reqTable
    }
}

let printer = new Building("printer", 0, [
    {energy: 10, metamaterials: 10, dna:0}, //Upgrade from 0 to 1
    {energy: 50, metamaterials: 100, dna:0}, //Upgrade from 1 to 2
    {energy: 100, metamaterials: 200, dna:0}, //Upgrade from 2 to 3
    {energy: 200, metamaterials: 500, dna:0}, //Upgrade from 3 to 4
    {energy: 400, metamaterials: 1000, dna:0}, //Upgrade from 4 to 5
])

let generator = new Building("generator", 0, [
    {energy: 10, metamaterials: 10, dna:0}, //Upgrade from 0 to 1
    {energy: 50, metamaterials: 100, dna:0}, //Upgrade from 1 to 2
    {energy: 100, metamaterials: 200, dna:0}, //Upgrade from 2 to 3
    {energy: 200, metamaterials: 500, dna:0}, //Upgrade from 3 to 4
    {energy: 400, metamaterials: 1000, dna:0}, //Upgrade from 4 to 5
])

let nursery = new Building("nursery", 0, [
    {energy: 10, metamaterials: 10, dna:0}, //Upgrade from 0 to 1
    {energy: 50, metamaterials: 100, dna:0}, //Upgrade from 1 to 2
    {energy: 100, metamaterials: 200, dna:0}, //Upgrade from 2 to 3
    {energy: 200, metamaterials: 500, dna:0}, //Upgrade from 3 to 4
    {energy: 400, metamaterials: 1000, dna:0}, //Upgrade from 4 to 5
])

let biopsyRoom = new Building("biopsyRoom", 0, [
    {energy: 10, metamaterials: 10, dna:0}, //Upgrade from 0 to 1
    {energy: 50, metamaterials: 100, dna:0}, //Upgrade from 1 to 2
    {energy: 100, metamaterials: 200, dna:0}, //Upgrade from 2 to 3
    {energy: 200, metamaterials: 500, dna:0}, //Upgrade from 3 to 4
    {energy: 400, metamaterials: 1000, dna:0}, //Upgrade from 4 to 5
])

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
    clearUpgradeArea()
    showBuildingDescription(b)
    showBuildingUpgrades(b)
    if (b.id == "printer"){
        printer.upgrade()
    }else{
        console.log("this is not a printer, ignore")
    }
}

function clearUpgradeArea(){
    document.getElementById("building-description").innerHTML = ""
    document.getElementById("building-upgrades").innerHTML = ""
}

function showBuildingUpgrades(b){
    console.log("showBuildingUpgrades")
    if (b.id == "ship"){
    
        let generatorIcon = generator.level == 0 ? "generator.svg" : "generator_built.svg"
        let generatorTooltip = generator.level == 0 ? generator.showRequirementsTable() : "Open building to upgrade"
        let printerIcon = printer.level == 0 ? "printer.svg" : "printer_built.svg"
        let nurseryIcon = nursery.level == 0 ? "nursery.svg" : "nursery_built.svg"
        let biopsyRoomIcon = biopsyRoom.level == 0 ? "biopsy_room.svg" : "biopsy_room_built.svg"
        let upgradesHTML = `
        <div>
            <img id="generator-build" class="build-button" src="./assets/images/${generatorIcon}" alt="">
            <p>${generatorTooltip}</p>
        </div>
        <div>
            <img id="printer-build" class="build-button" src="./assets/images/${printerIcon}" alt="">
        </div>
        <div>
            <img id="nursery-build" class="build-button" src="./assets/images/${nurseryIcon}" alt="">
        </div>
        <div>
            <img id="biopsy_room-build" class="build-button" src="./assets/images/${biopsyRoomIcon}" alt="">
        </div>
        `
        document.getElementById("building-upgrades").innerHTML = upgradesHTML
        document.getElementById("generator-build").addEventListener("click", function(){
            upgradeGenerator(b)
        })
    }
}

function upgradeGenerator(b){
    if(generator.level == "0"){
        document.getElementById("generator").classList.remove("disabled")
        document.getElementById("generator").classList.add("enabled")
        generator.upgrade()
        showBuildingUpgrades(b)
        updateGameLog(`You managed to salvage the ship's energy generator.<br>               
        It's in a sorry state but it should get you up and running. 
        You should be able to upgrade it eventually for Zoflogh to leave this planet.`)
    }else{
        updateGameLog("This building is already up and running. Open the building for more options")
    }
    
}

function showBuildingDescription(b){
    document.getElementById("building-description").innerHTML = buildingDescriptions[b.id]
}

function updateGameLog(m){
    let msgLog = ""
    if (m){
        gameMessages.unshift(m)
    }
    index = 0
    for (let msg of gameMessages){
        let color = index == 0 ? "highlight" : "normal";
        msgLog += `
        <p class="${color}">${msg}</p><hr>
        `
        index++
    }
    document.getElementById("game-log").innerHTML = msgLog
}

function start(){
    console.log("start")
    updateGameLog()
    getBuildings()
    resourceRefresh()
}

function update(){
    console.log("update")
}