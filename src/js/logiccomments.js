// Define the initial state of the tic-tac-toe board as a 3x3 array with all cells initially empty (filled with 0).
let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

// Define constants to represent the human player and the computer player.
let HUMAN = -1;
let COMP = +1;

// Function to evaluate the state of the game and return a score.
function evalute(state) {
    let score = 0;

    // Check if the computer player wins, if yes, assign a score of +1.
    if (gameOver(state, COMP)) {
        score = +1;
    }
    // Check if the human player wins, if yes, assign a score of -1.
    else if (gameOver(state, HUMAN)) {
        score = -1;
    } else {
        // If no one wins, assign a score of 0.
        score = 0;
    }

    return score;
}

// Function to check if a specific player wins.
function gameOver(state, player) {
    // Define all possible winning combinations on the board.
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

    // Iterate through all winning combinations to check if the specified player has won.
    for (let i = 0; i < 8; i++) {
        let line = win_state[i];
        let filled = 0;
        for (let j = 0; j < 3; j++) {
            if (line[j] == player)
                filled++;
        }
        // If all cells in a winning combination are filled by the specified player, return true.
        if (filled == 3)
            return true;
    }
    // If no winning combination is found, return false.
    return false;
}

// Function to check if either player has won the game.
function gameOverAll(state) {
    return gameOver(state, HUMAN) || gameOver(state, COMP);
}

// Function to find all empty cells on the board.
function emptyCells(state) {
    let cells = [];
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if (state[x][y] == 0)
                cells.push([x, y]);
        }
    }

    return cells;
}

// Function to check if a move is valid (if the chosen cell is empty).
function validMove(x, y) {
    let empties = emptyCells(board);
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

// Function to set a move on the board if the coordinates are valid.
function setMove(x, y, player) {
    if (validMove(x, y)) {
        board[x][y] = player;
        return true;
    }
    else {
        return false;
    }
}

// Function implementing the minimax algorithm to find the best move for the computer player.
function minimax(state, depth, player) {
    let best;

    // Initialize the best move with a placeholder value based on the current player.
    if (player == COMP) {
        best = [-1, -1, -1000];
    }
    else {
        best = [-1, -1, +1000];
    }

    // If the game has reached a terminal state or the maximum depth, evaluate the current state.
    if (depth == 0 || gameOverAll(state)) {
        let score = evalute(state);
        return [-1, -1, score];
    }

    // Iterate through all empty cells and recursively search for the best move.
    emptyCells(state).forEach(function (cell) {
        let x = cell[0];
        let y = cell[1];
        state[x][y] = player;
        let score = minimax(state, depth - 1, -player);
        state[x][y] = 0;
        score[0] = x;
        score[1] = y;

        // Update the best move based on the current player.
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

// Function to let the computer player make a move.
function aiTurn() {
    let x, y;
    let move;
    let cell;

    // If it's the first move, choose a random cell.
    if (emptyCells(board).length == 9) {
        x = parseInt(Math.random() * 3);
        y = parseInt(Math.random() * 3);
    }
    // Otherwise, use the minimax algorithm to choose the best move.
    else {
        move = minimax(board, emptyCells(board).length, COMP);
        x = move[0];
        y = move[1];
    }

    // Set the chosen move on the board and update the corresponding cell in the HTML.
    if (setMove(x, y, COMP)) {
        cell = document.getElementById(String(x) + String(y));
        cell.innerHTML = "O";
    }
}

// Function to handle the human player's move when a cell is clicked.
function clickedCell(cell) {
    let button = document.getElementById("bnt-restart");
    button.disabled = true;
    let conditionToContinue = gameOverAll(board) == false && emptyCells(board).length > 0;

    // Check if the game is still ongoing and if the clicked cell is empty.
    if (conditionToContinue == true) {
        let x = cell.id.split("")[0];
        let y = cell.id.split("")[1];
        let move = setMove(x, y, HUMAN);
        // If the move is valid, update the cell with the human player's symbol and let the computer player make its move.
        if (move == true) {
            cell.innerHTML = "X";
            if (gameOver(board, HUMAN)) {
                // Display a message indicating that the human player has won.
                let msg = document.getElementById("status");
                msg.innerHTML = "You win!";
                // Enable the restart button.
                button.value = "Restart";
                button.disabled = false;
                // Exit the function, as the game has ended.
                return;
			}
            if (conditionToContinue)
                aiTurn();
        }
    }
    // Check if the game is over and update the status message accordingly.
    if (gameOver(board, COMP)) {
        let lines;
        let cell;
        let msg;

        // Highlight the winning line on the board.
        if (board[        0][0] == 1 && board[0][1] == 1 && board[0][2] == 1)
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

	// Highlight the winning line on the board by changing the color of the cells.
	for (let i = 0; i < lines.length; i++) {
		cell = document.getElementById(String(lines[i][0]) + String(lines[i][1]));
		cell.style.color = "red";
	}

	// Display a message indicating that the human player has lost.
	msg = document.getElementById("status");
	msg.innerHTML = "You lose!";
}
// Check if the game is a draw.
if (emptyCells(board).length == 0 && !gameOverAll(board)) {
	// Display a message indicating that the game is a draw.
	let msg = document.getElementById("status");
	msg.innerHTML = "Draw!";
}
// Check if the game is over or if it's a draw, and enable the restart button.
if (gameOverAll(board) == true || emptyCells(board).length == 0) {
	button.value = "Restart";
	button.disabled = false;
}
}

// Function to restart the game.
function restartBnt(button) {
// If the button value is "Start AI", it means the game has not started yet, so let the AI make the first move.
if (button.value == "Start AI") {
	aiTurn();
	button.disabled = true;
}
// If the button value is "Restart", reset the board and clear the status message.
else if (button.value == "Restart") {
	let htmlBoard;
	let msg;

	// Reset each cell on the board to its initial state (empty).
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			board[x][y] = 0;
			htmlBoard = document.getElementById(String(x) + String(y));
			htmlBoard.style.color = "#444";
			htmlBoard.innerHTML = "";
		}
	}
	// Change the button value back to "Start AI" and clear the status message.
	button.value = "Start AI";
	msg = document.getElementById("status");
	msg.innerHTML = "";
}
}

