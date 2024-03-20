let board = [
	[0, 0, 0], // Y = 0
	[0, 0, 0], // Y = 1
	[0, 0, 0], // Y = 2
];

let playerName1 = localStorage.getItem('player1');
let noti = document.getElementById("notify");
noti.textContent = `Du börjar ${playerName1}`

let HUMAN = -1;
let COMP = +1;
let difficulty = 3;
/* Funktion som kollar det bästa resultatet för minimax algoritmen, 
datorn tänker vad resultatet blir efter varenda drag som den gör. */
function evaluate(state) {
	let score = 0;

	if (gameOver(state, COMP)) { // Om datorn har det mest gynnsamma resultatet så ger den +1 i poäng
		score = +1;
	} 
	else if (gameOver(state, HUMAN)) { // Om spelaren har det mest gynnsamma resultatet så ger den -1 i poäng
		score = -1;
	} else { // Annars 0
		score = 0;
	}
	// Returnerar resultatet till den som fråga.
	return score;
}

// Funktion som kollar om det finns en vinnare
function gameOver(state, player) {
	let win_state = [
		[state[0][0], state[0][1], state[0][2]],
		[state[1][0], state[1][1], state[1][2]],
		[state[2][0], state[2][1], state[2][2]],
		[state[0][0], state[1][0], state[2][0]],
		[state[0][1], state[1][1], state[2][1]],
		[state[0][2], state[1][2], state[2][2]],
		[state[0][0], state[1][1], state[2][2]],
		[state[2][0], state[1][1], state[0][2]],
	]; // Alla möjliga resultat
	/* Om en linje innehåller samma spelare så returnerar den true 
	(Någon har vunnit, den som har vunnit kollas vid gameOverAll).
	Ex, när i = 0 och j = 0, kollar den om det finns en spelare där, sedan forsätter den.
	Om det finns en spelare på vardera ruta i linjen så returnerar den true då filled har blivit 3. */
	for (let i = 0; i < 8; i++) {
		let line = win_state[i];
		let filled = 0;
		for (let j = 0; j < 3; j++) {
			if (line[j] == player)
				filled++;
		}
		if (filled == 3)
			return true;
	}
	return false;
}

/* Här kollar man om spelaren eller datorn har vunnit, om inte, returnera false, alltså spelet forsätter. */
function gameOverAll(state) {
	return gameOver(state, HUMAN) || gameOver(state, COMP);
}
/* Här skapar man en array av alla tomma rutor med korresponderande x och y värde. */
function tommarutor(state) {
	let rutor = [];
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			if (state[x][y] == 0)
				rutor.push([x, y]);
		}
	}

	return rutor;
}

/* Ett drag är acceptabelt om rutan är tom. */
function validMove(x, y) {
	try {
		if (board[x][y] == 0) {
			return true;
		}
		else {
			return false;
		}
	} catch (e) {
		return false;
	}
}

/* Funktion som kollar ifall om ett drag är acceptabelt, om inte så kommer inget placeras på rutan. */
function setMove(x, y, player) {
	if (validMove(x, y)) {
		board[x][y] = player;
		return true;
	}
	else {
		return false;
	}
}

// Ren jävla magi, funktion som använder sig av algoritmen "minimax" vilket undersöker spelets djup.
function minimax(state, depth, player) {
    let best;
	// Justera djupet beroende på vilken svårighetsgrad spelaren har valt.
    let maxDepth = 0;
    if (difficulty === 1) {
        maxDepth = 1; // Easy.
    } else if (difficulty === 2) {
        maxDepth = 5; // Medium.
    } else if (difficulty === 3) {
        maxDepth = 9; // Hard.
    }

	//
    if (player == COMP) {
        best = [-1, -1, -1000]; /* Här säger man till minimax att det bästa draget är vid x = -1 och y = -1 som har ett väldigt lågt poäng.
		Man gör det för att initiera algoritmen för att progressivt leta efter det bästa valet*/
    }
    else { /* Här sätter man att spelaren har placerat ett skit bra drag, detta är för att man ska
	lura minimax och få den att vilja reducera spelarens poäng genom att välja det bästa draget.*/
        best = [-1, -1, +1000];
    }
	/* Om djupet är uppnåd eller om spelet är över, 
	sätt x = -1 och y = -1 som en platshållare och poäng utifrån funktionen evaluate.
	*/
    if (depth == 0 || gameOverAll(state)) { 
        let score = evaluate(state);
        return [-1, -1, score];
    }

    // Här sker justeringen av djupet.
    if (depth > maxDepth) {
        depth = maxDepth;
    }
	// Loopar igenom alla tomma rutor.
    tommarutor(state).forEach(function (ruta) {
        let x = ruta[0]; // Hämtar rad.
        let y = ruta[1]; // Hämtar kolumn.
        state[x][y] = player; // -1 eller +1, spelaren eller datorn, ändrar berörda rutan till +1.
        let score = minimax(state, depth - 1, -player); // Värdera nästa drag med ett nytt tillstånd och minskat djupet.
        state[x][y] = 0; // Startar om allt efter att ha värderat ett potentiellt resultat
        score[0] = x; // Updatera koorditantera till nuvarande ruta innan den byter till nästa.
        score[1] = y; // Samma som ovan.

		// Updaterar det bästa draget relativt till spelaren
        if (player == COMP) {
            if (score[2] > best[2]) // Om poängen är bättre än den nuvarande bästa poängen, uppdatera det bästa draget
                best = score;
        }
        else {
            if (score[2] < best[2]) // Om poängen är sämre än den nuvarande bästa poängen, uppdatera det bästa draget
                best = score;
        }
    });
	// Returnerar det bästa draget som hittades
    return best;
}
// Funktion för att behandla datorns rutor.
function computerTurn() {
	let x, y;
	let move;
	let ruta;
    let playerName1 = localStorage.getItem('player1');
    let noti = document.getElementById("notify");
    noti.textContent = `Din tur ${playerName1}`
	// Om det bara finns tomma rutor (Spelare valde att roboten skulle starta) så väljer roboten en ruta av rena slumpen.
	if (tommarutor(board).length == 9) {
		x = parseInt(Math.random() * 3);
		y = parseInt(Math.random() * 3);
	}
	// Annars, använda minimax algoritmen.
	else {
		move = minimax(board, tommarutor(board).length, COMP); // Få bästa val
		x = move[0]; // Ta ut x-värdet, rad.
		y = move[1]; // Ta ut y-värdet, kolumn.
	}
	// Uppdatera rutan som datorn valde med ett O.
	if (setMove(x, y, COMP)) {
		ruta = document.getElementById(String(x) + String(y));
		ruta.innerHTML = "O";
	}
}

// Funktion för att behandla spelarens ruta (som spelaren tröck på).
function clickedruta(ruta) {
    let playerName1 = localStorage.getItem('player1');
    let noti = document.getElementById("notify");
    let button = document.getElementById("btn-restart");
    noti.textContent = `Din tur ${playerName1}`
    button.disabled = true;
    let conditionToContinue = gameOverAll(board) == false && tommarutor(board).length > 0;
	// Om spelet är igång, hämta information om den ruta spelaren klickade på och ändra till X
    if (conditionToContinue == true) {
        let x = ruta.id.split("")[0];
        let y = ruta.id.split("")[1];
        let move = setMove(x, y, HUMAN);
        if (move == true) {
            ruta.innerHTML = "X";
            // Kollar om spelaren har vunnit efter hens tur.
            if (gameOver(board, HUMAN)) {
                let msg = document.getElementById("status");
                msg.innerHTML = "You win!";
                // Om spelaren vinner, ändra färgen på vinnande linjen till grön.
                let lines = getWinningLine(board, HUMAN); // här hämtar den linjen
                lines.forEach(function (ruta) {
                    let winRuta = document.getElementById(String(ruta[0]) + String(ruta[1]));
                    winRuta.style.color = "green";
                });
                // Möjlighet att starta om spelet.
                button.value = "Restart";
                button.disabled = false;
                return;
            }
			// Säg till roboten att spela
            if (conditionToContinue)
                computerTurn();
        }
    }
	/* Om roboten vinner, ändra färgen på vinnande linjen till röd.
	Anledningen att if koden nedan ej är där uppe (if (move == true)) blocket 
	är eftersom att den skulle kolla om roboten har vunnit efter spelarens tur,
	vilket är onödigt. */
    if (gameOver(board, COMP)) {
        let lines = getWinningLine(board, COMP);
        lines.forEach(function (ruta) {
            let winRuta = document.getElementById(String(ruta[0]) + String(ruta[1]));
            winRuta.style.color = "red";
        });
        let msg = document.getElementById("status");
        msg.innerHTML = "You lose!";
    }
	// Om det inte finns tomma rutor och ingen vinnare finns, skriv oavgjort.
    if (tommarutor(board).length == 0 && !gameOverAll(board)) {
        let msg = document.getElementById("status");
        msg.innerHTML = "Draw!";
    }
	// Om spelet är över, ge möjligheten att starta om
    if (gameOverAll(board) == true || tommarutor(board).length == 0) {
        button.value = "Restart";
        button.disabled = false;
    }
}

// Funktion för att få fram vinnande linje (används för att ändra färg).
function getWinningLine(state, player) {
    let lines = [
        [[0, 0], [0, 1], [0, 2]], // linje 0.
        [[1, 0], [1, 1], [1, 2]], // linje 1 osv.
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]]
    ];
	// Innebär att den loopar igenom alla linjer och går vidare till j.
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let win = true;
		// j tar information från arrayens array, ex [0, 0] (X och Y).
        for (let j = 0; j < line.length; j++) {
            let ruta = line[j];
            let x = ruta[0];
            let y = ruta[1];
            if (state[x][y] != player) { // om spelare inte finns i en av vinnande linjer, avbryt.
                win = false;
                break;
            }
        }
        if (win) { // Om något kallar på funktionen och det finns en vinnande linje, ge information om linjen.
            return line;
        }
    }
    return [];
}


// Starta om spelet
function restartBtn(button) {
    let playerName1 = localStorage.getItem('player1');
    let noti = document.getElementById("notify");
    noti.textContent = `Du börjar ${playerName1}`
	if (button.value == "AI Startar") {
		computerTurn();
		button.disabled = true;
	} else if (button.value == "Restart") {
		let htmlBoard;
		let msg;
/* Om man startar om matchen ska den tömma alla rutor.
Exempelvis i början så är x = 0 och y = 0, därav tömms rutan 00. */
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				board[x][y] = 0;
				htmlBoard = document.getElementById(String(x) + String(y));
				htmlBoard.style.color = "#FFF";
				htmlBoard.innerHTML = "";
			}
		}
		button.value = "AI Startar";
		msg = document.getElementById("status");
		msg.innerHTML = "";
	}
}

// När man trycker på "go back to home page" så behöver man nollställa spelets nuvarande status
function clearBoardAndRedirect() {
    clearBoard();

}

function clearBoard() {
    let playerName1 = localStorage.getItem('player1');
    let noti = document.getElementById("notify");
    noti.textContent = `Din tur ${playerName1}`
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            board[x][y] = 0;
            let htmlBoard = document.getElementById(String(x) + String(y));
            htmlBoard.style.color = "#FFF";
            htmlBoard.innerHTML = "";
        }
    }
}