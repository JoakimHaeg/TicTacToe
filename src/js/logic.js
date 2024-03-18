let board = [
	[0, 0, 0], // Y = 0
	[0, 0, 0], // Y = 1
	[0, 0, 0], // Y = 2
];

let HUMAN = -1;
let COMP = +1;

/* Function to heuristic evaluation of state. */
function evalute(state) {
	let score = 0;

	if (gameOver(state, COMP)) {
		score = +1;
	}
	else if (gameOver(state, HUMAN)) {
		score = -1;
	} else {
		score = 0;
	}

	return score;
}

/* This function tests if a specific player wins */
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
	];

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

/* This function test if the human or computer wins */
function gameOverAll(state) {
	return gameOver(state, HUMAN) || gameOver(state, COMP);
}

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

/* A move is valid if the chosen ruta is empty */
function validMove(x, y) {
	let empties = tommarutor(board);
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

/* Set the move on board, if the coordinates are valid */
function setMove(x, y, player) {
	if (validMove(x, y)) {
		board[x][y] = player;
		return true;
	}
	else {
		return false;
	}
}

/* *** AI function that choice the best move *** */
// Read more on https://github.com/Cledersonbc/tic-tac-toe-minimax/
function minimax(state, depth, player) {
	let best;

	if (player == COMP) {
		best = [-1, -1, -1000];
	}
	else {
		best = [-1, -1, +1000];
	}

	if (depth == 0 || gameOverAll(state)) {
		let score = evalute(state);
		return [-1, -1, score];
	}

	tommarutor(state).forEach(function (ruta) {
		let x = ruta[0];
		let y = ruta[1];
		state[x][y] = player;
		let score = minimax(state, depth, -player);
		state[x][y] = 0;
		score[0] = x;
		score[1] = y;

		if (player == COMP) {
			if (score[2] > best[2])
				best = score;
		}
		else {
			if (score[2] < best[2])
				best = score;
		}
	});

	return best;
}

/* It calls the minimax function */
function aiTurn() {
	let x, y;
	let move;
	let ruta;

	if (tommarutor(board).length == 9) {
		x = parseInt(Math.random() * 3);
		y = parseInt(Math.random() * 3);
	}
	else {
		move = minimax(board, tommarutor(board).length, COMP);
		x = move[0];
		y = move[1];
	}

	if (setMove(x, y, COMP)) {
		ruta = document.getElementById(String(x) + String(y));
		ruta.innerHTML = "O";
	}
}

/* main */
function clickedruta(ruta) {
	let button = document.getElementById("btn-restart");
	button.disabled = true;
	let conditionToContinue = gameOverAll(board) == false && tommarutor(board).length > 0;

	if (conditionToContinue == true) {
		let x = ruta.id.split("")[0];
		let y = ruta.id.split("")[1];
		let move = setMove(x, y, HUMAN);
		if (move == true) {
			ruta.innerHTML = "X";
			// Kollar om spelaren har vunnit
			if (gameOver(board, HUMAN)) {
                let msg = document.getElementById("status");
                msg.innerHTML = "You win!";
                button.value = "Restart";
                button.disabled = false;
                return;
			}
			if (conditionToContinue)
				aiTurn();
		}
	}
	if (gameOver(board, COMP)) {
		let lines;
		let ruta;
		let msg;

		if (board[0][0] == 1 && board[0][1] == 1 && board[0][2] == 1)
			lines = [[0, 0], [0, 1], [0, 2]];
		else if (board[1][0] == 1 && board[1][1] == 1 && board[1][2] == 1)
			lines = [[1, 0], [1, 1], [1, 2]];
		else if (board[2][0] == 1 && board[2][1] == 1 && board[2][2] == 1)
			lines = [[2, 0], [2, 1], [2, 2]];
		else if (board[0][0] == 1 && board[1][0] == 1 && board[2][0] == 1)
			lines = [[0, 0], [1, 0], [2, 0]];
		else if (board[0][1] == 1 && board[1][1] == 1 && board[2][1] == 1)
			lines = [[0, 1], [1, 1], [2, 1]];
		else if (board[0][2] == 1 && board[1][2] == 1 && board[2][2] == 1)
			lines = [[0, 2], [1, 2], [2, 2]];
		else if (board[0][0] == 1 && board[1][1] == 1 && board[2][2] == 1)
			lines = [[0, 0], [1, 1], [2, 2]];
		else if (board[2][0] == 1 && board[1][1] == 1 && board[0][2] == 1)
			lines = [[2, 0], [1, 1], [0, 2]];

		for (let i = 0; i < lines.length; i++) {
			ruta = document.getElementById(String(lines[i][0]) + String(lines[i][1]));
			ruta.style.color = "red";
		}

		msg = document.getElementById("status");
		msg.innerHTML = "You lose!";
	}
	// Kollar om spelet är över.
	if (tommarutor(board).length == 0 && !gameOverAll(board)) {
		let msg = document.getElementById("status");
		msg.innerHTML = "Draw!";
	}
	// Om rundan är över, ge möjligheten till spelaren att starta om.
	if (gameOverAll(board) == true || tommarutor(board).length == 0) {
		button.value = "Restart";
		button.disabled = false;
	}
}

// Starta om spelet
function restartBtn(button) {
	if (button.value == "Start AI") {
		aiTurn();
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
				htmlBoard.style.color = "#444";
				htmlBoard.innerHTML = "";
			}
		}
		button.value = "Start AI";
		msg = document.getElementById("status");
		msg.innerHTML = "";
	}
}