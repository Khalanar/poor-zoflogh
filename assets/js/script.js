let gameMessages = [
    "message1",
    "message2",
    "message3"
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