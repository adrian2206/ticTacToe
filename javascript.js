const Gameboard = (function() {
        const row = 3;
        const column = 3;
        let board = [];
        for(let i = 0; i < row; i++) {
            board[i] = [];
            for(let j = 0; j < column; j++) {
                board[i][j] = '';
            }
        }

    const getBoard = () => board;

    const resetBoard = () => {
        board = [];
    }

    return {
        getBoard,
        resetBoard,
    }
    })();

const Players = (function() {
    const createPlayer = function(name, marker) {
        return {name, marker, score: 0};
    }

    const player1 = createPlayer('name1', 'X');
    const player2 = createPlayer('name2', '0');

    let activePlayer = player1;
    const switchPlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const resetPlayer = () => {
        activePlayer = player1;
    };

    const resetScore = () => {
        player1.score = 0;
        player2.score = 0;
    };

    return {
        player1,
        player2,
        get activePlayer() {return activePlayer;},
        switchPlayer,
        resetPlayer,
        resetScore
    }
})();

const Game = (function() {
        const board = Gameboard.getBoard();
        let gameOver = false;

        const checkWinner = (board) => {
            const winningCondition = [
                [board[0][0], board[0][1], board[0][2]],
                [board[1][0], board[1][1], board[1][2]],
                [board[2][0], board[2][1], board[2][2]],

                [board[0][0], board[1][0], board[2][0]],
                [board[0][1], board[1][1], board[2][1]],
                [board[0][2], board[1][2], board[2][2]],

                [board[0][0], board[1][1], board[2][2]],
                [board[0][2], board[1][1], board[2][0]],
            ];

            return winningCondition.some(condition => 
                condition[0] != '' && condition[0] === condition[1] && condition[1] === condition[2]
            );
        }

        const makeMove = (i, j) => {
        if(!gameOver && board[i][j] === '') {
            board[i][j] = Players.activePlayer.marker;

            if(checkWinner(board)) {
                Players.activePlayer.score++;
                gameOver = true;
                return;
            }

            if(board.flat().every(cell => cell != '')){
                gameOver = true;
                return;
            }

            Players.switchPlayer();

        }
    }

    const newGame = () => {
        gameOver = false;
        board.forEach(row => row.fill(''));
        Gameboard.getBoard();
        Players.resetPlayer();
        GameDisplay.displayBoard();
    };

    const newMatch = () => {
        gameOver = false;
        board.forEach(row => row.fill(''));
        Gameboard.getBoard();
        Players.resetPlayer();
        Players.resetScore();
        GameDisplay.displayBoard();
    };


    return {
        makeMove,
        newGame,
        get gameOver() { return gameOver; },
        checkWinner,
        newMatch
    };
})();

const GameDisplay = (function() {
    const board = Gameboard.getBoard();
    const boardElement = document.getElementById('game-board');
    const playersInfo = document.getElementById('player-info');
    const scoreInfo = document.getElementById('score');
    const player1Info = document.createElement('p');
    const player2Info = document.createElement('p');
    const turnInfo = document.createElement('p');

    scoreInfo.append(player1Info, player2Info);
    playersInfo.append(turnInfo);

    const displayBoard = () => {
        boardElement.innerHTML = '';
        const isWinner = Game.checkWinner(board);
        const isTie = !isWinner && board.flat().every(cell => cell !== '');

        if(isWinner) {
            turnInfo.textContent = `Winner is ${Players.activePlayer.name}!`;
        } else if(isTie) {
            turnInfo.textContent = `It's a Tie!`;
        } else {
            turnInfo.textContent = `${Players.activePlayer.name}'s turn (${Players.activePlayer.marker})`;
        }
        player1Info.textContent = `${Players.player1.name}: ${Players.player1.score}`;
        player2Info.textContent = `${Players.player2.name}: ${Players.player2.score}`;

        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell-button');
                cellButton.style.height = '100px';
                cellButton.style.width = '100px';
                cellButton.style.fontSize = '2rem';

                cellButton.textContent = cell;

                cellButton.addEventListener('click', () => {
                    Game.makeMove(i, j);
                    displayBoard();
                });

                boardElement.appendChild(cellButton);
            });
        });
    };

    const startNewGame = document.getElementById('new-game');
    startNewGame.addEventListener('click', Game.newGame);

    const startNewMatch = document.getElementById('new-match');
    startNewMatch.addEventListener('click', Game.newMatch);

    return {
        displayBoard,
    };
})();

GameDisplay.displayBoard();
