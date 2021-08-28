let gameMessages = [
    "Oh no... an alien has crashed into Planet Earth.<br><br> Poor Zoflogh.",
]

let buildingDescriptions = {
    ship: "Zoflogh's crashed ship.<br><br>Luckily some parts can be salvaged with enough creativity and spare time.<br><br>You may need to access earthen materials to get out of here, build your way out of this planet.",
    generator: "Solar Powered Generator.<br><br>Salvaged off some spare parts of Zoflogh's ship, this generator transforms photons emitted by the closest star into energy.<br><br>Can be upgraded for better energy output",
    nursery: "Nursery and Incubator.<br><br>Froongkians edited their genome for asexual reproduction, leisurly sex is however encouraged as a bonding exercise.<br><br>Use DNA to lay eggs, and energy to incubate them.",
    printer: "A Recycler and 3D Printer by Uglog Industries.<br><br>Insert any type of matter to be recycled into metamaterial, the only material used in planet Froongk. For walls and electronics to clothing, it is incredibly poisonous, do not ingest.",
    biopsy_room:"Biopsy Room.<br><br>Start abduction missions to collect DNA samples from creatures around the planet.<br><br>Froongkian laws strongly advise against bonding with abductees, however it's not forbidden.",
}

let resources = {
    energy: 0,
    metamaterials: 20,
    dna: 0,
}

document.addEventListener("DOMContentLoaded", start())

function resourceRefresh(){
    document.getElementById("energy").innerText = resources.energy
    document.getElementById("metamaterials").innerText = resources.metamaterials
    document.getElementById("dna").innerText = resources.dna
    console.log("Refreshed resources card")
}

function recalculateEnergyOutput(){
    console.log(`Generator output is ${generator.resourceGeneration[generator.level]}`)
    resources.energy += generator.resourceGeneration[generator.level]
    resourceRefresh()
}

function generateMetamaterials(){
    console.log("generated x")
}

function spendResources(e, m, d){
    resources.energy -= e
    resources.metamaterials -= m
    resources.dna -= d

    resourceRefresh()
}

class Building{
    constructor(name, level, upgradeRequirements, resourceGeneration){
        this.name = name;
        this.level = level;
        this.maxLevel = 5;
        this.upgradeRequirements = upgradeRequirements;
        this.resourceGeneration = resourceGeneration;
    }

    upgrade(){
        if (this.level < this.maxLevel){
            let enoughEnergy = this.upgradeRequirements[this.level].energy <= resources.energy
            let enoughMetamaterials = this.upgradeRequirements[this.level].metamaterials <= resources.metamaterials
            let enoughDna = this.upgradeRequirements[this.level].dna <= resources.dna
            let enoughResources = enoughEnergy && enoughMetamaterials && enoughDna
            if (enoughResources){
                spendResources(this.upgradeRequirements[this.level].energy,
                    this.upgradeRequirements[this.level].metamaterials,
                    this.upgradeRequirements[this.level].dna)
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
        let reqEnergy = this.upgradeRequirements[this.level].energy
        let reqMetamaterials = this.upgradeRequirements[this.level].metamaterials
        let reqDNA = this.upgradeRequirements[this.level].dna

        let energyRow = reqEnergy > 0 ? `
            <tr>
                <td>${Object.keys(this.upgradeRequirements[this.level])[0]}</td>
                <td>${this.upgradeRequirements[this.level].energy}</td>
            </tr>` : ""

        let metaRow = reqMetamaterials > 0 ? `
            <tr>
                <td>metamat.</td>
                <td>${this.upgradeRequirements[this.level].metamaterials}</td>
            </tr>` : ""

        let dnaRow = reqDNA > 0 ? `
            <tr>
                <td>${Object.keys(this.upgradeRequirements[this.level])[2]}</td>
                <td>${this.upgradeRequirements[this.level].dna}</td>
            </tr>` : ""

        let reqTable = `
        
        <table>
            ${energyRow}
            ${metaRow}
            ${dnaRow}
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
    {energy: 0, metamaterials: 10, dna:0}, //Upgrade from 0 to 1
    {energy: 0, metamaterials: 100, dna:0}, //Upgrade from 1 to 2
    {energy: 0, metamaterials: 200, dna:0}, //Upgrade from 2 to 3
    {energy: 0, metamaterials: 500, dna:0}, //Upgrade from 3 to 4
    {energy: 0, metamaterials: 1000, dna:0}, //Upgrade from 4 to 5
], [0, 50, 500, 1000, 2000])

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
        let printerTooltip = printer.level == 0 ? printer.showRequirementsTable() : "Open building to upgrade"
        
        let nurseryIcon = nursery.level == 0 ? "nursery.svg" : "nursery_built.svg"
        let biopsyRoomIcon = biopsyRoom.level == 0 ? "biopsy_room.svg" : "biopsy_room_built.svg"
        let upgradesHTML = `
        <div>
            <img id="generator-build" class="build-button" src="./assets/images/${generatorIcon}" alt="">
            <p>${generatorTooltip}</p>
        </div>
        <div>
            <img id="printer-build" class="build-button" src="./assets/images/${printerIcon}" alt="">
            <p>${printerTooltip}</p>
        </div>
        <div>
            <img id="nursery-build" class="build-button" src="./assets/images/${nurseryIcon}" alt="">
        </div>
        <div>
            <img id="biopsy_room-build" class="build-button" src="./assets/images/${biopsyRoomIcon}" alt="">
        </div>
        `
        document.getElementById("building-upgrades").innerHTML = upgradesHTML
        document.getElementById("generator-build").addEventListener("click", function(){buildGenerator(b)})
        document.getElementById("printer-build").addEventListener("click", function(){buildPrinter(b)})
    }
}

function buildGenerator(b){
    if(generator.level == "0"){
        document.getElementById("generator").classList.remove("disabled")
        document.getElementById("generator").classList.add("enabled")
        generator.upgrade()
        recalculateEnergyOutput()
        showBuildingUpgrades(b)
        updateGameLog(`You managed to salvage the ship's energy generator.<br>               
        It's in a sorry state but it should get you up and running. 
        You will have to upgrade it eventually for Zoflogh to leave this planet.`)
    }else{
        updateGameLog("This building is already up and running. Open the building for more options")
    }
    
}

function buildPrinter(b){
    if(printer.level == "0"){
        document.getElementById("printer").classList.remove("disabled")
        document.getElementById("printer").classList.add("enabled")
        printer.upgrade()
        showBuildingUpgrades(b)
        updateGameLog(`With what little was to be found in the cargo bay, you managed to build a recycler.<br>               
        Zoflogh can now recycle whatever he finds into metamaterials, used for pretty much everything.  
        Upgrade this device to increase the output.`)
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