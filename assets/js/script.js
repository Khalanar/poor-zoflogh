let gameMessages = [
    "Oh no... an alien has crashed into Planet Earth.<br><br> Poor Zoflogh.",

]

document.addEventListener("DOMContentLoaded", start())

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
}

function update(){
    console.log("update")
}