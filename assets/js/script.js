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
    energyConsumed: 0,
    metamaterials: 2000.0,
    dna: 0,
    availableAliens: 3,
}

let currentScreen = ""

let updateMillis = 100;

document.addEventListener("DOMContentLoaded", start())

function resourceRefresh(){
    document.getElementById("energy").innerText = resources.energy - resources.energyConsumed
    document.getElementById("metamaterials").innerText = parseInt(resources.metamaterials)
    document.getElementById("dna").innerText = resources.dna
    document.getElementById("aliens").innerText = resources.availableAliens
}

function recalculateEnergyOutput(){
    resources.energy = generator.resourceGeneration[generator.level]
    resourceRefresh()
}

function generateMetamaterials(){
    let generated = printer.resourceGeneration[printer.level]*(printer.assignedWorkers+1)/1000*updateMillis
    resources.metamaterials += generated;
    resourceRefresh()
}

function spendResources(e, m, d){
    resources.energyConsumed += e
    resources.metamaterials -= m
    resources.dna -= d
    resourceRefresh()
}

class Building{
    #buildMessage;
    assignedWorkers = 0;
    
    constructor(name, level, upgradeRequirements, resourceGeneration){
        this.name = name;
        this.level = level;
        this.maxLevel = 5;
        this.upgradeRequirements = upgradeRequirements;
        this.resourceGeneration = resourceGeneration;
        

        this.enoughEnergy = this.upgradeRequirements[this.level].energy  <= resources.energy - resources.energyConsumed
        this.enoughMetamaterials = this.upgradeRequirements[this.level].metamaterials <= resources.metamaterials
        this.enoughDna = this.upgradeRequirements[this.level].dna <= resources.dna
        
        this.enoughResources = this.enoughEnergy && this.enoughMetamaterials && this.enoughDna
    }

    updateRequirements(){
        if(this.level + 1 < this.maxLevel){
            this.enoughEnergy = this.upgradeRequirements[this.level].energy <= resources.energy - resources.energyConsumed
            this.enoughMetamaterials = this.upgradeRequirements[this.level].metamaterials <= resources.metamaterials
            this.enoughDna = this.upgradeRequirements[this.level].dna <= resources.dna
            
            this.enoughResources = this.enoughEnergy && this.enoughMetamaterials && this.enoughDna
        }
    }

    upgrade(){
        this.updateRequirements()
        if (this.level < this.maxLevel){
            if (this.enoughResources){
                spendResources(this.upgradeRequirements[this.level].energy,
                    this.upgradeRequirements[this.level].metamaterials,
                    this.upgradeRequirements[this.level].dna)
                this.level++;
                console.log("Upgraded this building to " + this.level)
                if (this.level>1)updateGameLog("Upgrade successful")
            }else{
                let msg = `Not enough resources to upgrade the ${this.name}, poor Zoflogh`
                updateGameLog(msg)
            }
        }
    }

    requirementsTable(c){
        this.updateRequirements()
        if(this.level + 1 < this.maxLevel){
            let reqEnergy = this.upgradeRequirements[this.level].energy
            let reqMetamaterials = this.upgradeRequirements[this.level].metamaterials
            let reqDNA = this.upgradeRequirements[this.level].dna
            let colorClass;

            colorClass = this.enoughEnergy ? "green" : "red"
            colorClass = c ? colorClass : ""
            let energyRow = reqEnergy > 0 ? `
                <tr class="${colorClass}">
                    <td>${Object.keys(this.upgradeRequirements[this.level])[0]}</td>
                    <td>${this.upgradeRequirements[this.level].energy}</td>
                </tr>` : ""

            colorClass = this.enoughMetamaterials ? "green" : "red"
            colorClass = c ? colorClass : ""
            let metaRow = reqMetamaterials > 0 ? `
                <tr class="${colorClass}">
                    <td>metamat.</td>
                    <td>${this.upgradeRequirements[this.level].metamaterials}</td>
                </tr>` : ""

            colorClass = this.enoughDna ? "green" : "red"
            colorClass = c ? colorClass : ""
            let dnaRow = reqDNA > 0 ? `
                <tr class="${colorClass}">
                    <td>${Object.keys(this.upgradeRequirements[this.level])[2]}</td>
                    <td>${this.upgradeRequirements[this.level].dna}</td>
                </tr>` : ""

            let reqTable = 
            `<table>
                ${energyRow}
                ${metaRow}
                ${dnaRow}
            </table>
            `
            return reqTable
        }else{
            return "MAX level"
        }
    }

    assignWorker(){
        if (resources.availableAliens > 0){
            this.assignedWorkers ++
            resources.availableAliens --
            updateGameLog(`Alien assigned to the ${this.name}, output close to optimal performance`)
         
        }else{
            updateGameLog(`Not enough aliens to help at the ${this.name}<br><br>Poor Zoflogh`)
        }
    }

    removeWorker(){
        if (this.assignedWorkers > 0){
            this.assignedWorkers --
            resources.availableAliens ++
            updateGameLog(`An alien left the ${this.name}<br><br>Reassign it soon!`)
        }else{
            updateGameLog(`Noone is working at the ${this.name}`)
        }
    }

    showBuilding(){
        document.getElementById(this.name).classList.remove("disabled")
        document.getElementById(this.name).classList.add("enabled")
    }

    get buildMessage(){
        return this.#buildMessage
    }

    set buildMessage(m){
        if (m != ""){
            this.#buildMessage = m;
        }
    }

}

let printer = new Building("printer", 0,
    [   {energy: 10, metamaterials: 10, dna:0}, //Upgrade from 0 to 1
        {energy: 50, metamaterials: 100, dna:0}, //Upgrade from 1 to 2
        {energy: 100, metamaterials: 200, dna:0}, //Upgrade from 2 to 3
        {energy: 200, metamaterials: 500, dna:0}, //Upgrade from 3 to 4
        {energy: 400, metamaterials: 1000, dna:0}, //Upgrade from 4 to 5
    ], 
    [0, 1, 10, 100, 200, 500])

printer.buildMessage = `With what little was to be found in the cargo bay, you managed to build a recycler.<br><br>  
Upgrade building or assign an idle alien to this device to increase the output.`

let generator = new Building("generator", 0,
    [   {energy: 0, metamaterials: 10, dna:0}, //Upgrade from 0 to 1
        {energy: 0, metamaterials: 50, dna:0}, //Upgrade from 1 to 2
        {energy: 0, metamaterials: 200, dna:0}, //Upgrade from 2 to 3
        {energy: 0, metamaterials: 500, dna:0}, //Upgrade from 3 to 4
        {energy: 0, metamaterials: 1000, dna:0}, //Upgrade from 4 to 5
    ],
    [0, 100, 500, 2000, 3000, 5000])

generator.buildMessage = `You managed to salvage the ship's energy generator.<br><br>It's in a sorry state but it should get you up and running.`

let biopsyRoom = new Building("biopsy_room", 0, 
[
    {energy: 200, metamaterials: 500, dna:0}, //Upgrade from 0 to 1
    {energy: 400, metamaterials: 1000, dna:0}, //Upgrade from 1 to 2
    {energy: 800, metamaterials: 2000, dna:0}, //Upgrade from 2 to 3
    {energy: 1500, metamaterials: 5000, dna:0}, //Upgrade from 3 to 4
    {energy: 2000, metamaterials: 10000, dna:0}, //Upgrade from 4 to 5
])

biopsyRoom.buildMessage = `Sweet biopsy room built, go abduce some stuff!`

let nursery = new Building("nursery", 0, 
[
    {energy: 500, metamaterials: 600, dna:0}, //Upgrade from 0 to 1
    {energy: 650, metamaterials: 1000, dna:0}, //Upgrade from 1 to 2
    {energy: 1000, metamaterials: 1500, dna:0}, //Upgrade from 2 to 3
    {energy: 1250, metamaterials: 3200, dna:0}, //Upgrade from 3 to 4
    {energy: 2000, metamaterials: 9000, dna:0}, //Upgrade from 4 to 5
])

nursery.buildMessage = `Reproduce and conquer!`

function getBuildings(){
    let buildings = document.getElementsByClassName("building");
    
    for (let b of buildings){
        b.addEventListener("click", function(){
            clickBuilding(b)
        })
        // console.log(`${b.id} initialised`);
    }
}

function clickBuilding(b){
    console.log("clicked " + b.id)
    currentScreen = b.id
    redrawScreen(currentScreen)
}

function clearUpgradeArea(){
    document.getElementById("building-description").innerHTML = ""
    document.getElementById("building-upgrades").innerHTML = ""
}

/**
 * Creates html code for ship upgrades, which are used to construct the different buildings
 * @param {*} building - Object of class Building
 * @param {*} name     - Name of the building to reference the html side
 * @returns html tags for the button
 */
function buildIcons(building, name){
    let icon = building.level == 0 ? `${name}.svg` : `${name}_built.svg`
    let tooltip = building.level == 0 ? building.requirementsTable(false) : "Open building to upgrade"
    let buttonId = `${name}-build`
    let reqId = `${name}-build-requirements`
    let iconHTML = `
    <div>
        <img id="${buttonId}" class="build-button" src="./assets/images/${icon}" alt="">
        <div id="${reqId}">${tooltip}</div>
    </div>
    `
    document.getElementById("building-upgrades").innerHTML += iconHTML

}

function showBuildingUpgrades(){
    let upgradesHTML = ""
    document.getElementById("building-upgrades").innerHTML = ""
    if (currentScreen == "ship"){
        buildIcons(generator,   "generator")
        buildIcons(printer,     "printer")
        buildIcons(biopsyRoom,  "biopsy_room")
        buildIcons(nursery,     "nursery")
        
        let buttons = document.getElementsByClassName("build-button")
        for(let button of buttons){
            // console.log(button.id)
            let b
            if (button.id == "generator-build"){
                b = generator
            }
            if (button.id == "printer-build"){
                b = printer
            }
            if (button.id == "biopsy_room-build"){
                b = biopsyRoom
            }
            if (button.id == "nursery-build"){
                b = nursery
            }

            let reqId = `${button.id}-requirements`
            if (b.level == 0){
                button.addEventListener("click", function(){build(b)})
                button.addEventListener("mouseenter", function(){ document.getElementById(reqId).innerHTML = b.requirementsTable(true) })
                button.addEventListener("mouseleave", function(){ document.getElementById(reqId).innerHTML = b.requirementsTable(false) })
            }
        }
    }else if(currentScreen == "generator"){
        let upgradesHTML = ""
        upgradesHTML += `   
        <div>
            <img id="generator-upgrade" class="build-button" src="./assets/images/generator.svg" alt="">
            <div id="generator-requirements">${generator.requirementsTable(false)}</div>
        </div>
        <div></div><div></div>
        <div>
            <p>Total energy output:</p>
            <p>${resources.energy}</p><br>
            <p>Total consumed by buildings:</p>
            <p>${resources.energyConsumed}</p>
        </div>
        `
        document.getElementById("building-upgrades").innerHTML = upgradesHTML
        document.getElementById("generator-upgrade").addEventListener("click", function(){upgradeBuilding(generator)})
        document.getElementById("generator-upgrade").addEventListener("mouseenter", function(){

            document.getElementById("generator-requirements").innerHTML = generator.requirementsTable(true)
        })
        document.getElementById("generator-upgrade").addEventListener("mouseleave", function(){

            document.getElementById("generator-requirements").innerHTML = generator.requirementsTable(false)
        })
    
    }else if(currentScreen == "printer"){
        upgradesHTML += `   
        <div>
            <img id="printer-upgrade" class="build-button" src="./assets/images/printer.svg" alt="">
            <div id="printer-requirements">${printer.requirementsTable(false)}</div>
        </div>
        <div>
            <img id="assign-alien" class="build-button" src="./assets/images/assign_alien.svg" alt="">
        </div>
        <div>
            <img id="remove-alien" class="build-button" src="./assets/images/remove_alien.svg" alt="">
        </div>
        <div>
            <p>Base output:</p>
            <p>${printer.resourceGeneration[printer.level]}</p>

            <p>Assigned aliens:</p>
            <p>${printer.assignedWorkers}</p>
            <br>
            <p>Current Output:</p>
            <p>${printer.resourceGeneration[printer.level]*(printer.assignedWorkers+1)} p/s</p>
        </div>
        `
        document.getElementById("building-upgrades").innerHTML = upgradesHTML
        document.getElementById("printer-upgrade").addEventListener("click", function(){upgradeBuilding(printer)})
        
        document.getElementById("printer-upgrade").addEventListener("mouseenter", function(){
            document.getElementById("printer-requirements").innerHTML = printer.requirementsTable(true)
        })
        document.getElementById("printer-upgrade").addEventListener("mouseleave", function(){
            document.getElementById("printer-requirements").innerHTML = printer.requirementsTable(false)
        })
        
        document.getElementById("assign-alien").addEventListener("click", function(){updateWorkers(printer, this.id)})
        document.getElementById("remove-alien").addEventListener("click", function(){updateWorkers(printer, this.id)})

    }
}

function updateWorkers(building, c){
    if (c == "assign-alien") {
        building.assignWorker()
    }else{
        building.removeWorker()
    }
    showBuildingUpgrades()
}

function build(building){
    if (building.level == "0"){
    
        if (building.enoughResources){
            building.upgrade()
            building.showBuilding()
            recalculateEnergyOutput()
            showBuildingUpgrades()
            updateGameLog(building.buildMessage)
        }else{
            updateGameLog("Not enough resources to build, poor Zoflogh")
        }
    }else if(building.level > "0"){
        updateGameLog("This building is already up and running. Open the building for more options")
    }
}


function upgradeBuilding(building){
    building.upgrade()
    recalculateEnergyOutput()
    showBuildingUpgrades()
    console.log("upgrade - " + building.name) 
}

function buildBiopsyRoom(b){
    if (biopsyRoom.level == "0"){
        biopsyRoom.upgrade()
        if(biopsyRoom.enoughResources){
            document.getElementById("biopsy_room").classList.remove("disabled")
            document.getElementById("biopsy_room").classList.add("enabled")
            showBuildingUpgrades(b)
            updateGameLog(`Created biopsy room`)
        }
    }else if(biopsyRoom.level > "0"){
        updateGameLog("This building is already up and running. Open the building for more options")
    }
}

function buildNursery(b){
    if (nursery.level == "0"){
        nursery.upgrade()
        if(nursery.enoughResources){
            document.getElementById("nursery-build").classList.remove("disabled")
            document.getElementById("nursery-build").classList.add("enabled")
            showBuildingUpgrades(b)
            updateGameLog(`Created biopsy room`)
        }
    }else if(nursery.level > "0"){
        updateGameLog("This building is already up and running. Open the building for more options")
    }
}

function showBuildingDescription(b){
    document.getElementById("building-description").innerHTML = buildingDescriptions[currentScreen]
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

function redrawScreen(currentScreen){
    clearUpgradeArea()
    showBuildingDescription(currentScreen)
    showBuildingUpgrades(currentScreen)
}

function start(){
    console.log("start")
    updateGameLog()
    getBuildings()
    resourceRefresh()
    setInterval(update, updateMillis)
    //setInterval(redrawScreen, 1000)
}

function update(){
    generateMetamaterials()
}