let btnY = document.getElementById("btnYes");
let btnN = document.getElementById("btnNo");
let btnStart = document.getElementById("btnStart");

btnStart.value = "Restart";
btnStart.disabled = false;

function showStartButton() {
    document.getElementById("btnStartContainer").style.display = "block";
}