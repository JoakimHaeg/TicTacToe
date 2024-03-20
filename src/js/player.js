let rutor = document.querySelectorAll(".ruta");
let statusInfo = document.querySelector("#status");
let urlParams = new URLSearchParams(window.location.search);
let playerName1 = localStorage.getItem('player1');
let playerName2 = localStorage.getItem('player2');
let btn = document.getElementById("btnStart");

let playerName = [playerName1, playerName2];

console.log("Player Name 1:", playerName1);
console.log("Player Name 2:", playerName2);


let winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let gameState = ["","","","","","","","",""];
let currentPlayer = ["X", playerName[0]]
let active = true;

function startGame(){
    if (btn.value == "start game") {
        btn.value = "Restart"
    rutor = document.querySelectorAll(".ruta");
    statusInfo = document.querySelector("#status");
    playerName1 = localStorage.getItem('player1');
    playerName2 = localStorage.getItem('player2');
    playerName = [playerName1, playerName2]
    currentPlayer = ["X", playerName[0]]
    rutor.forEach(ruta => ruta.addEventListener("click", rutaClicked)) // "Loopar" igenom alla rutor och ger dom en addEventListener med ett click event och en funktion rutaClicked()
    statusInfo.textContent = `${currentPlayer[1]}'s tur` // Vems tur det är
    active = true;
    } else {
        clearGame()
    }
}

function rutaClicked(){
    let rutaIndex = this.getAttribute("rutaIndex"); //Värdet av rutan

    if(gameState[rutaIndex] != "" || !active){ // om rutaIndex i html har ett värde eller ifall om spelet inte är igång, gå inte vidare med att ge en ruta ett värde
        return;
    }

    updateRuta(this, rutaIndex); // uppdaterar ruta
    checkWinner(); // kollar om det finns en vinnare
}

function updateRuta(ruta, index){
    gameState[index] = currentPlayer[0]; // ger arrayen gameState ett värde av "currentPlayer" på plats index.
    ruta.textContent = currentPlayer[0]; // gör värdet synligt.
}

function changePlayer(){
    let statusInfo = document.querySelector("#status");
    currentPlayer[0] = (currentPlayer[0] == "X") ? "O" : "X";
    currentPlayer[1] = (currentPlayer[1] == playerName1) ? playerName2 : playerName1;
    statusInfo.textContent = `${currentPlayer[1]}'s tur`;
}

function checkWinner(){
    let crt = currentPlayer[1];
    let roundWon = false; //Ingen spelare har vunnit

    for (let winCondition of winningConditions) { //loop
        let a = gameState[winCondition[0]]; 
        let b = gameState[winCondition[1]]; 
        let c = gameState[winCondition[2]];
    
        if (a === '' || b === '' || c === '') { //om antingen av värdena inte har något i sig, forsätt.
            continue;
        }
    
        if (a === b && b === c) { //om alla värden har samma värde så vinner man
            roundWon = true;
            let winRuta1 = document.getElementById(String(winCondition[0]));
            let winRuta2 = document.getElementById(String(winCondition[1]));
            let winRuta3 = document.getElementById(String(winCondition[2]));
            winRuta1.style.color = "green";
            winRuta2.style.color = "green";
            winRuta3.style.color = "green";
            break;
        }
    }

    if(roundWon){ //om det finns en vinnare
        let statusInfo = document.querySelector("#status");
        statusInfo.textContent = `${crt} vann` //skriv vem som vann (spelare som precis körde)
        active = false;
    }
    else if(!gameState.includes("")){ //Om det inte finns tomma rutor blev det lika
        statusInfo.textContent = `Det blev lika`
    }
    else{
        changePlayer(); //byt spelare annars
    }
}

function clearGame() {
    clear();
}

function clear() {
    for (let i = 0; i < 9; i++) {
        let square = document.getElementById(i.toString());
        if (square) {
            square.style.color = "#FFF";
        }
    }
    btn.value = "start game"
    gameState = ["", "", "", "", "", "", "", "", ""];
    rutor.forEach(ruta => ruta.textContent = "");
    currentPlayer = ["X", playerName[1]];
    statusInfo.textContent = ``;
    active = false;
}