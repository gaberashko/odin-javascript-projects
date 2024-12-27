
// Cell object for each cell on the board.
function Cell(rowVal, columnVal) {
    const row = rowVal;
    const column = columnVal;
    let value = "";

    const setVal = (val) => {
        value = val;
    };
    const getVal = () => {
        return value;
    };
    const getRow = () => row;
    const getColumn = () => column;

    return {setVal, getVal, getRow, getColumn};
}

// Gameboard object.
// Row x Column matrix (ASSUME ROWS == COLUMNS)
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    // Create the empty board.
    for (let i = 0; i < rows; ++i) {
        board[i] = [];
        for (let j = 0; j < columns; ++j) {
            board[i].push(Cell(i, j));
        }
    }

    const size = () => board.length;

    const getBoard = () => board;

    // Check if the value can be placed at said spot on the board.
    function isAvailable(row, col) {
        return (board[row][col].getVal() === "");
    }

    // Handles the player placing a move.
    const placeMark = function(row, col, mark) {
        if (isAvailable(row, col)) {
            board[row][col].setVal(mark);
        }
    };
 
    return {placeMark, getBoard, size};
}

function GameHandler(playerOneName, playerTwoName) {
    // Initialize players and board.
    const players = [
        {
            name: (playerOneName == "") ? "Player One" : playerOneName,
            mark: "X",
        },
        {
            name: (playerTwoName == "") ? "Player Two" : playerTwoName,
            mark:"O",
        }
    ];
    const board = Gameboard();
    const boardSize = board.size();
    let isEnded = false;

    const getIsEnded = () => isEnded;

      // Check if all values in row are same.
      function rowWin(row, val) {
        for (let i = 0; i < boardSize; ++i) {
            if (board.getBoard()[row][i].getVal() != val) {
                return false;
            }
        }
        isEnded = "row";
        return true;
    }
    // Check if all values in column are same.
    function colWin(col, val) {
        for (let i = 0; i < boardSize; ++i) {
            if (board.getBoard()[i][col].getVal() != val) {
                return false;
            }
        }
        isEnded = "col";
        return true;
    }
    // Check if diagonal values are same.
    function diagWin(val) {
        let diagonal = true;
        for (let i = 0; i < boardSize; ++i) {
            if (board.getBoard()[i][i].getVal() != val) {
                diagonal = false;
            }
        }
        if (diagonal == true) {
            isEnded = "ldiag";
            return diagonal;
        } else {
            diagonal = true;
            for (let i = 0; i < boardSize; ++i) {
                if (board.getBoard()[boardSize-1-i][i].getVal() != val) {
                    diagonal = false;
                }
            }
        }
        if (diagonal) {
            isEnded = "rdiag";
        }
        return diagonal;
    }
    // Check if the move has won the game.
    const isWon = (row, col) => {
        const value = board.getBoard()[row][col].getVal();
        return (rowWin(row, value) || colWin(col, value) || diagWin(value));
    };

    
    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    // Handles the logic for playing a round:
    // Place marker if possible,
    const playRound = (row, col) => {
        board.placeMark(row, col, activePlayer.mark);
        if (isWon(row, col)) {
        } else {
            switchActivePlayer();
        }
    }

    return {getActivePlayer, isWon, playRound, getBoard: board.getBoard, getIsEnded};
}

function ScreenHandler(playerOneName, playerTwoName) {
    // Initialize the game, and the boardDiv and results wrapper for displaying results.
    const game = GameHandler(playerOneName, playerTwoName);
    const boardDiv = document.querySelector(".board-wrapper");
    const resultsDiv = document.querySelector(".results-wrapper");
    // Handles the logic for rendering the new board and active player.
    function render() {
        const currentPlayer = game.getActivePlayer();
        boardDiv.innerHTML = "";
        const board = game.getBoard();
        // Render current board.
        board.forEach((row) => {
            row.forEach((cell) => {
                const cellButton = document.createElement("button");
                cellButton.classList = "cell xfnt";
                cellButton.dataset.row = cell.getRow();
                cellButton.dataset.col = cell.getColumn();
                cellButton.textContent = cell.getVal();

                boardDiv.appendChild(cellButton);
            })
        });
        resultsDiv.textContent = game.getIsEnded() ? `${currentPlayer.name} has won!` : `It's ${currentPlayer.name}'s turn`;
    }

    function colorCells(row, col, endStatus) {
        let cells = [];
        if (endStatus === "row") {
            cells = document.querySelectorAll(`[data-row="${row}"]`);
        } else if (endStatus === "col") {
            cells = document.querySelectorAll(`[data-col="${col}"]`);
        } else {
            cells = document.querySelectorAll('[data-row][data-col]');
            // Row === Col
            if (endStatus === "ldiag") {
                cells = Array.from(cells).filter(element => {
                    return element.getAttribute("data-row") == element.getAttribute("data-col");
                });
            } else if (endStatus === "rdiag") {
                cells = Array.from(cells).filter(element => {
                    return ((parseInt(element.getAttribute("data-row")) + parseInt(element.getAttribute("data-col"))) === parseInt(game.getBoard().length) - 1);
                });
            }
        }
        cells.forEach((cell) => {
            cell.classList.toggle("win-cell");
        });
    }

    function clickHandlerBoard(e) {
        const selectedRow = parseInt(e.target.dataset.row);
        const selectedCol = parseInt(e.target.dataset.col);

        if (selectedRow == -1 || selectedCol == -1) return;
        game.playRound(selectedRow, selectedCol);
        render();

        if (game.getIsEnded()) {
            let gameEndedStatus = game.getIsEnded();
            colorCells(selectedRow, selectedCol, gameEndedStatus);

            boardDiv.removeEventListener("click", clickHandlerBoard);
        }
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
    // Initial render.
    render();
}

// Create logic for start button.
const boardWrapperDiv = document.querySelector("#board");
const titleDiv = document.querySelector(".title-wrapper");
const startBtn = document.querySelector(".start-btn");

startBtn.addEventListener("click", () => {
    titleDiv.classList.toggle("hidden");
    boardWrapperDiv.classList.toggle("hidden");

    // Obtain player name values for GameHandler.
    let p1Div = document.querySelector("#player1");
    let p2Div = document.querySelector("#player2");
    let p1Name = p1Div.value, p2Name = p2Div.value;

    ScreenHandler(p1Name, p2Name);
});

// Create logic for restart button.
const restartBtn = document.querySelector("#restart-btn");
restartBtn.addEventListener("click", () => {
    titleDiv.classList.toggle("hidden");
    boardWrapperDiv.classList.toggle("hidden");
});

