let gameManager = {
    testmode: true,
    forcedBuildingLevel: 2,
    currentScreen: "",
    updateMillis: 10,
}

let saveData = {
    // buildingLevel: {
        // "generator": 1,
        // "printer": 1,
        // "biopsyRoom": 1,
        // "nursery": 1,
        // "radio": 1,
    // },
}

function saveGame(){
    //Save object to json in localstorage
    if (Object.keys(saveData).length > 0){
        console.log("saveData is not empty")
        localStorage.setItem("save_data", JSON.stringify(saveData))
        console.log(`Game saved`)
    }else{
        console.log("saveData is empty")
    }

}

function loadGame(){
    if (Object.keys(saveData).length <= 0){
        let level = gameManager.testmode ? gameManager.forcedBuildingLevel : 0
        saveData.buildingLevel = {
            "generator":    level,
            "printer":      level,
            "biopsyRoom":   level,
            "nursery":      level,
            "radio":        level,
        }
        saveGame()
        console.log("GAMEDATA WRITTEN")
    }else{
        //get json in localstorage if any and fill up certain globals
        saveData = JSON.parse(localStorage.getItem("save_data"))
        console.log("GAMEDATA LOADED")
    }

    generator.setLevel(saveData.buildingLevel["generator"])
    printer.setLevel(saveData.buildingLevel["printer"])
    biopsyRoom.setLevel(saveData.buildingLevel["biopsyRoom"])
    nursery.setLevel(saveData.buildingLevel["nursery"])
    radio.setLevel(saveData.buildingLevel["radio"])

}

function resetGameData(){
    console.log("RESET")
    localStorage.clear()
}

let gameMessages = [
    "Oh no... an alien has crashed into Planet Earth.<br><br>Zoflogh is counting on you to get him out of this planet.<br><br><i>Poor Zoflogh...",
]

let buildingDescriptions = {
    ship: "Zoflogh's crashed ship.<br><br>Luckily some parts can be salvaged with creativity and spare time.<br><br>Build your way out of this planet!",
    generator: "Solar Power Generator.<br><br>Salvaged off some spare parts of Zoflogh's ship, this generator transforms photons into energy.<br><br>Can be upgraded for better energy output",
    nursery: "Nursery and Incubator.<br><br>Froongkians edited their genome for asexual reproduction centuries ago<br><br>Use DNA to lay eggs, and energy to incubate them.",
    printer: "A Recycler and 3D Printer by Uglog Industries.<br><br>Insert any type of matter to be recycled into metamaterial, the only material used in planet Froongk. For walls and electronics to clothing, it is incredibly poisonous, do not ingest.",
    biopsy_room:"Biopsy Room.<br><br>Start abduction missions to collect DNA samples from creatures around the planet.<br><br>Froongkian laws strongly advise against bonding with abductees, however it's not forbidden.",
    radio:"A makeshift radio. Rudimentary and objectively ugly, but it works.<br><br>Get Zoflogh to send an S.O.S and hope for the best!!",
}

let resources = {
    energy: 0,
    energyConsumed: 0,
    metamaterials: 30.0,
    dna: 0,
    availableAliens: 1,

    reload: function(){
        document.getElementById("energy").innerText = this.energy - this.energyConsumed
        document.getElementById("metamaterials").innerText = parseInt(this.metamaterials)
        document.getElementById("dna").innerText = this.dna
        document.getElementById("aliens").innerText = this.availableAliens
    },
    
    setTestModeValues: function(){
        this.energy = 10000
        this.metamaterials = 5000
        this.dna = 50
        this.availableAliens = 10
        this.reload()
    },

    recalculateEnergyOutput: function (){
        this.energy = generator.resourceGeneration[generator.level]
        this.reload()
    },
    
    generateMetamaterials: function (){
        let generated = printer.resourceGeneration[printer.level]*(printer.assignedWorkers+1)/1000*gameManager.updateMillis
        this.metamaterials += generated;
        this.reload()
    },
    
    addDNA: function (n){
        this.dna += n
        this.reload()
    },

    useDNA: function (n){
        console.log(`Current DNA: ${this.dna} | spend: ${n}`)
        this.dna -= n
        console.log(`Current DNA: ${this.dna}`)
        this.reload()
    },
    
    addAlien(){
        this.availableAliens ++
        this.reload()
    },

    spend: function (energy, metamaterials, dna){
        this.energyConsumed += energy
        this.metamaterials -= metamaterials
        this.dna -= dna
        this.reload()
    },



}

let abduction = {
    inProgress: false,
    progress: 0,
    totalDuration: 1,
    currentPhase: 0,
    maxYield: 5,
    gameLog: "Abduction complete, head over to the biopsy room to harvest DNA samples",
    phase: [
        "No abduction in progress",
        "Finding target to abduct...",
        "Transporting target to biopsy room...",
        "Sticking needles in places...",
        "Complete, harvest DNA samples",
    ],

    abductionCheck: function(){
        if(document.getElementById("abduct").innerText == "Harvest"){
            this.harvest()
            
        }else{
            this.begin()
        }
    },

    begin: function(){
        if(!this.inProgress){
            this.inProgress = true
            this.totalDuration = biopsyRoom.resourceGeneration[biopsyRoom.level]
            console.log("abduct!" + this.totalDuration)
        }else{
            console.log("Abduction already in progress")
        }
    },
    
    changeAbductionStatus: function(n) {
        if (document.getElementById("abduction-stage")){
            this.currentPhase = n
            document.getElementById("abduction-stage").innerText = this.phase[this.currentPhase]
        }
    },
    
    harvest: function(){
        let harvestYield = Math.floor(Math.random() * this.maxYield)
        resources.addDNA(harvestYield)
        updateGameLog(`Harvest complete:<br><br>${harvestYield} DNA samples acquired.`)
        this.reset()
    },
    
    reset: function(){
        this.inProgress = false;
        this.progress = 0;
        document.getElementById("abduction-progress-bar").style.width = "0%"
        document.getElementById("abduct").innerText = "Abduct"
        this.changeAbductionStatus(0)
    },

    calculateAbductionProgress: function(){
        if (this.inProgress && this.progress < 100){
            this.progress += 1000/gameManager.updateMillis/this.totalDuration/100

            if (document.getElementById("abduction-progress-bar")){
                document.getElementById("abduction-progress-bar").style.width = `${this.progress}%`
            }
            if(this.progress >= 100){
                if (document.getElementById("abduct")){
                    document.getElementById("abduct").innerText = "Harvest"
                }
                this.changeAbductionStatus(4)
                updateGameLog(this.gameLog)
        
            }else if(this.progress >= 60){
                this.changeAbductionStatus(3)
            
            }else if(this.progress >= 30){
                this.changeAbductionStatus(2)
            
            }else if(this.progress >= 0){
                this.changeAbductionStatus(1)
            }
        }
    }
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
                resources.spend(this.upgradeRequirements[this.level].energy,
                    this.upgradeRequirements[this.level].metamaterials,
                    this.upgradeRequirements[this.level].dna)
                this.level++;
                console.log("Upgraded this building to " + this.level)
                if (this.level>1){
                    // updateGameLog("Upgrade successful")
                }
            }else{
                let msg = `Not enough resources to upgrade the ${this.name}, poor Zoflogh`
                updateGameLog(msg)
            }
        }
    }

    requirementsTable(c){
        this.updateRequirements()
        if(this.level + 1 <= this.maxLevel){
            let reqEnergy = this.upgradeRequirements[this.level].energy
            let reqMetamaterials = this.upgradeRequirements[this.level].metamaterials
            let reqDNA = this.upgradeRequirements[this.level].dna
            let colorClass;

            colorClass = this.enoughEnergy ? "green" : "red"
            colorClass = c ? colorClass : ""
            let energyRow = reqEnergy > 0 ? `
                <tr class="${colorClass}">
                    <td><i class="fas fa-bolt"></i></td>
                    <td class="j-right">${this.upgradeRequirements[this.level].energy}</td>
                </tr>` : ""

            colorClass = this.enoughMetamaterials ? "green" : "red"
            colorClass = c ? colorClass : ""
            let metaRow = reqMetamaterials > 0 ? `
                <tr class="${colorClass}">
                    <td><i class="fas fa-tools"></i></td>
                    <td class="j-right">${this.upgradeRequirements[this.level].metamaterials}</td>
                </tr>` : ""

            colorClass = this.enoughDna ? "green" : "red"
            colorClass = c ? colorClass : ""
            let dnaRow = reqDNA > 0 ? `
                <tr class="${colorClass}">
                    <td><i class="fas fa-dna"></i></td>
                    <td class="j-right">${this.upgradeRequirements[this.level].dna}</td>
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
            // updateGameLog(`An alien left the ${this.name}<br><br>Reassign it soon!`)
        }else{
            updateGameLog(`No one is working at the ${this.name}`)
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

    setLevel(level){
        this.level = level;
        if (level > 0) this.showBuilding()
    }
}

let printer = new Building("printer", 0,
    [   {energy: 10, metamaterials: 10, dna:0}, //Upgrade from 0 to 1
        {energy: 50, metamaterials: 100, dna:0}, //Upgrade from 1 to 2
        {energy: 100, metamaterials: 200, dna:0}, //Upgrade from 2 to 3
        {energy: 200, metamaterials: 500, dna:0}, //Upgrade from 3 to 4
        {energy: 400, metamaterials: 1000, dna:0}, //Upgrade from 4 to 5
    ],  [0, 5, 10, 50, 100, 200])
printer.buildMessage = `With what little was to be found in the cargo bay, you managed to build a recycler.<br><br>  
Upgrade building or assign an idle alien to this device to increase the output.`

let generator = new Building("generator", 0,
    [   {energy: 0, metamaterials: 5, dna:0}, //Upgrade from 0 to 1
        {energy: 0, metamaterials: 15, dna:0}, //Upgrade from 1 to 2
        {energy: 0, metamaterials: 200, dna:0}, //Upgrade from 2 to 3
        {energy: 0, metamaterials: 500, dna:0}, //Upgrade from 3 to 4
        {energy: 0, metamaterials: 1000, dna:0}, //Upgrade from 4 to 5
    ],  [0, 10, 50, 500, 2000, 7500])
generator.buildMessage = `You managed to salvage the ship's energy generator.<br><br>It's in a sorry state but it has got enough juice to kickstart the <i>3D Recycler</i>`

let biopsyRoom = new Building("biopsy_room", 0, 
[
    {energy: 200,   metamaterials: 500,      dna:0}, //Upgrade from 0 to 1
    {energy: 400,   metamaterials: 1000,     dna:5}, //Upgrade from 1 to 2
    {energy: 800,   metamaterials: 2000,     dna:5}, //Upgrade from 2 to 3
    {energy: 1500,  metamaterials: 5000,     dna:5}, //Upgrade from 3 to 4
    {energy: 2000,  metamaterials: 10000,    dna:5}, //Upgrade from 4 to 5
], [999, 30, 25, 15, 10, 5])
biopsyRoom.buildMessage = `Sweet biopsy room built, go abduce some stuff!`

let nursery = new Building("nursery", 0, 
[
    {energy: 500,   metamaterials: 600,     dna:5}, //Upgrade from 0 to 1
    {energy: 650,   metamaterials: 1000,    dna:5}, //Upgrade from 1 to 2
    {energy: 1000,  metamaterials: 1500,    dna:5}, //Upgrade from 2 to 3
    {energy: 1250,  metamaterials: 3200,    dna:5}, //Upgrade from 3 to 4
    {energy: 2000,  metamaterials: 9000,    dna:5}, //Upgrade from 4 to 5
], [999, 20, 15, 10, 5, 2, 1])
nursery.buildMessage = `Nursery built. No time to waste, get some eggs in the hatchery to grow your workforce!`

let radio = new Building("radio", 0, [{energy: 5000, metamaterials: 5000, dna:20}], 0)
radio.buildMessage = `Radio built! You're one step closer to getting your message out. Hopefully mother ship will pick your communication!`


let hatchery = {
    running: false,
    totalTime: 10,
    currentProgress: 0,
    dnaCost: 10,

    start: function(){
        if (!this.running){
            if (resources.dna - this.dnaCost >= 0){
                resources.useDNA(this.dnaCost)
                resources.dna
                this.totalTime = nursery.resourceGeneration[nursery.level]
                this.running = true;
                this.currentProgress = 0;
            }
        }else{
            if (this.currentProgress > 2){
                this.reset()
                resources.addAlien()
                document.getElementById("hatchery-canvas-1").style.backgroundImage="url('assets/images/egg.svg')"
                updateGameLog("An egg has hatched! Zoflogh has a new companion!")
            }
        }
    },
    
    getProgress: function(){
        if (this.running){
            this.currentProgress += (gameManager.updateMillis/1000) / this.totalTime * 2

            if(this.currentProgress > 2){
                if (document.getElementById("hatchery-canvas-1")){
                    document.getElementById("hatchery-canvas-1").style.backgroundImage="url('assets/images/egg-ready.svg')"
                }
            }
        }
        return this.currentProgress
    },

    reset: function() {
        console.log("RESET")
        this.running = false
        this.currentProgress = 0
    },

    drawProgress: function(){
        let progress = this.getProgress()
        if (document.getElementById("hatchery-canvas-1")){
            let canvas = document.getElementById("hatchery-canvas-1");
            let context = canvas.getContext("2d");

            context.clearRect(0, 0, canvas.width, canvas.height);
            // context.drawImage("/assets/images/egg.svg", 0, 0)
            context.rotate(270 * (Math.PI / 180));
            context.beginPath();
            context.arc(-75, 75, 60, 0 * Math.PI, progress * Math.PI);

            context.lineWidth = 15
            // context.strokeStyle = "rgba(0, 0, 0, 0.2)";
            context.strokeStyle = "rgba(152, 207, 195, 0.7)";
            context.stroke();
        }
    }
}

function getBuildings(){
    let buildings = document.getElementsByClassName("building");
    
    for (let b of buildings){
        b.addEventListener("click", function(){
            clickBuilding(b)
        })
    }
}

function clickBuilding(b){
    gameManager.currentScreen = b.id
    redrawScreen()
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
    let tooltip = building.level == 0 ? building.requirementsTable(false) : "Construction complete"
    let buttonId = `${name}-build`
    let reqId = `${name}-build-requirements`
    let iconHTML = `<img id="${buttonId}" class="build-button" src="./assets/images/${icon}" alt="">
                    <div id="${reqId}">${tooltip}</div>`

    let wrapperDiv = document.createElement('div')
    wrapperDiv.innerHTML = iconHTML
    document.getElementById("building-upgrades").appendChild(wrapperDiv)

    if (building.level == 0){
        document.getElementById(buttonId).addEventListener("click", function(){build(building)})
        document.getElementById(buttonId).addEventListener("mouseenter", function(){ document.getElementById(reqId).innerHTML = building.requirementsTable(true) })
        document.getElementById(buttonId).addEventListener("mouseleave", function(){ document.getElementById(reqId).innerHTML = building.requirementsTable(false) })
    }
}

function drawBuildingScreen(){
    let upgradesHTML = ""
    let alienicon =""
    console.log("draw buildings")
    document.getElementById("building-upgrades").innerHTML = ""
    if (gameManager.currentScreen == "ship"){
        showBuildingDescription()

        buildIcons(generator,   "generator")
        //REQUIREMENTS This code needs to be refactored
        if (generator.level > 1){   buildIcons(printer,   "printer") }
        if (printer.level > 1){     buildIcons(biopsyRoom,"biopsy_room")}
        if (biopsyRoom.level > 1){  buildIcons(nursery,   "nursery")}
        if (nursery.level > 1){     buildIcons(radio,     "radio")}
        

    }else if(gameManager.currentScreen == "generator"){
        showBuildingDescription()

        //Show Buttons
        upgradesHTML += `   
        <div>
            <img id="generator-upgrade" class="build-button" src="./assets/images/generator.svg" alt="">
            <div id="generator-requirements" class="requirements">${generator.requirementsTable(false)}</div>
        </div>
        <div></div><div></div>
        <div class="double-col-span">
            <p>Total output:</p>
            <p>${resources.energy}</p>
            <p>Total consumed:</p>
            <p>${resources.energyConsumed}</p><br>
            <p>Available energy:</p>
            <p>${resources.energy-resources.energyConsumed}</p>
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
    
    }else if(gameManager.currentScreen == "printer"){
        showBuildingDescription()

        for (let i=0; i<printer.assignedWorkers; i++){
            alienicon += `<div class="alien-icon"><img src="assets/images/alien-icon-light.svg"></div>`
        }

        // src="./assets/images/assign_alien.svg"
        upgradesHTML += `   
        <div>
            <img id="printer-upgrade" class="build-button" src="./assets/images/printer.svg" alt="">
            <div id="printer-requirements" class="requirements">${printer.requirementsTable(false)}</div>
        </div>
        <div id="assigned-aliens">
            <div id="assigned-aliens-board">
                ${alienicon}
            </div>
            <div>
                <div id="assign-alien" class="assign-button" alt="">++</div>
                <div id="remove-alien" class="assign-button" alt="">--</div>
            </div>
        </div>

   
   
        <div class="double-col-span">
            <p>Base output:</p>
            <p>${printer.resourceGeneration[printer.level]}</p>

            <p>Assigned aliens:</p>
            <p>${printer.assignedWorkers}</p>
            <br>
            <p>Total output:</p>
            <p>${printer.resourceGeneration[printer.level]*(printer.assignedWorkers+1)} p/s</p>
        </div>
        `

        // All these events can be refactored to be reused in all screens

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

    }else if(gameManager.currentScreen == "biopsy_room"){
        showBuildingDescription()
        let abductionButtonName = abduction.inProgress ? "Harvest" : "Abduct"
        upgradesHTML += `   
        <div>
            <img id="biopsy_room-upgrade" class="build-button" src="./assets/images/biopsy_room.svg" alt="">
            <div id="biopsy_room-requirements" class="requirements">${biopsyRoom.requirementsTable(false)}</div>
        </div>
        <div id="abduction-progress-area">
            <p id="abduction-stage">${abduction.phase[abduction.currentPhase]}</p>
            <div id="abduction-progress-container">
                <div id="abduction-progress-bar"></div>
            </div>
            <p id="abduct" class="abduction-button">${abductionButtonName}</p>
        </div>
        `
        document.getElementById("building-upgrades").innerHTML = upgradesHTML
        document.getElementById("abduction-progress-bar").style.width = `${abduction.progress}%`
        document.getElementById("abduct").addEventListener("click", function(){
            abduction.abductionCheck()
        })

        document.getElementById("biopsy_room-upgrade").addEventListener("click", function(){upgradeBuilding(biopsyRoom)})
        
        document.getElementById("biopsy_room-upgrade").addEventListener("mouseenter", function(){
            document.getElementById("biopsy_room-requirements").innerHTML = biopsyRoom.requirementsTable(true)
        })
        document.getElementById("biopsy_room-upgrade").addEventListener("mouseleave", function(){
            document.getElementById("biopsy_room-requirements").innerHTML = biopsyRoom.requirementsTable(false)
        })
        //redraw progress bar   
    }else if(gameManager.currentScreen == "nursery"){
        showBuildingDescription()
        upgradesHTML += `   
        <div>
        <img id="nursery-upgrade" class="build-button" src="./assets/images/nursery.svg" alt="">
        <div id="nursery-requirements" class="requirements">${nursery.requirementsTable(false)}</div>
        </div>
        <div>
        <div class="sq-button">     
        
        <canvas id="hatchery-canvas-1"></canvas>
        
     
        </div>
        <p id="egg-requirements"><i class="fas fa-dna"></i> ${hatchery.dnaCost}</p> 
        </div>
        `
        document.getElementById("building-upgrades").innerHTML = upgradesHTML

        document.getElementById("nursery-upgrade").addEventListener("click", function(){upgradeBuilding(nursery)})
        
        document.getElementById("hatchery-canvas-1").addEventListener("mouseenter", function(){
            if (hatchery.dnaCost < resources.dna){
                document.getElementById("egg-requirements").classList.add("green")
                document.getElementById("egg-requirements").classList.remove("red")
           
            }else{
                document.getElementById("egg-requirements").classList.add("red")
                document.getElementById("egg-requirements").classList.remove("green")
           
            }
        })
        document.getElementById("hatchery-canvas-1").addEventListener("mouseleave", function(){
            document.getElementById("egg-requirements").classList.remove("red")
            document.getElementById("egg-requirements").classList.remove("green")
        
        })

        document.getElementById("nursery-upgrade").addEventListener("mouseenter", function(){
            console.log("mouseenter nursery")
            document.getElementById("nursery-requirements").innerHTML = nursery.requirementsTable(true)
            
        })
        document.getElementById("nursery-upgrade").addEventListener("mouseleave", function(){
            document.getElementById("nursery-requirements").innerHTML = nursery.requirementsTable(false)
        })

        document.getElementById("hatchery-canvas-1").addEventListener("click", function(){
            hatchery.start()
        })

    }else if(gameManager.currentScreen == "radio"){
        showBuildingDescription()
    }
}

function updateWorkers(building, c){
    if (c == "assign-alien") {
        building.assignWorker()
    }else{
        building.removeWorker()
    }
    drawBuildingScreen()
}

function build(building){
    if (building.level == "0"){
        if (building.enoughResources){
            building.upgrade()
            building.showBuilding()
            resources.recalculateEnergyOutput()
            drawBuildingScreen()
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
    resources.recalculateEnergyOutput()
    drawBuildingScreen()
}

function showBuildingDescription(b){
    document.getElementById("building-description").innerHTML = buildingDescriptions[gameManager.currentScreen]
    // document.getElementById("building-description").innerHTML = b.description
}

function updateGameLog(m){
    if (m != gameMessages[0]){
        let msgLog = ""
        if (m){
            gameMessages.unshift(m)
        }
        let index = 0
        for (let msg of gameMessages){
            let color = index == 0 ? "highlight" : "normal";
            msgLog += `
            <p class="${color}">${msg}</p><hr>
            `
            index++
        }
        document.getElementById("game-log").innerHTML = msgLog
    }
}

function redrawScreen(){
    clearUpgradeArea()
    drawBuildingScreen()
}

function setHelpHover(){
    document.getElementById("help-icon").addEventListener("mouseenter", function(){
        document.getElementById("help-card").classList.add("enabled")
        document.getElementById("help-card").classList.remove("disabled")
    })
    document.getElementById("help-icon").addEventListener("mouseleave", function(){
        document.getElementById("help-card").classList.add("disabled")
        document.getElementById("help-card").classList.remove("enabled")
    })
}

document.addEventListener("DOMContentLoaded", start())

function setupButtons(){
    document.getElementById("reset-data").addEventListener("click", function(){
        resetGameData()
    })
}

function start(){
    console.log("start")
    loadGame()
    setupButtons()
    setHelpHover()
    updateGameLog()
    getBuildings()
    setInterval(update, gameManager.updateMillis)

    if (gameManager.testmode) {
        resources.setTestModeValues()
        console.log(`Test Mode ON: Resources reset `)
    }
}

function update(){
    resources.generateMetamaterials()
    abduction.calculateAbductionProgress()
    hatchery.drawProgress()
}