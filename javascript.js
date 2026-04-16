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

    const player1 = createPlayer('First Player', 'X');
    const player2 = createPlayer('Second Player', '0');

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
    const playersTurn = document.getElementById('player-turn');
    const player1Display = document.getElementById('player1-display');
    const player2Display = document.getElementById('player2-display');
    const player1Info = document.createElement('p');
    player1Info.style.fontSize = "14px";
    const player1Score = document.createElement('p');
    player1Score.style.color = '#185FA5'
    player1Score.style.fontSize = '2rem';
    const player2Info = document.createElement('p');
    player2Info.style.fontSize = "14px";
    const player2Score = document.createElement('p');
    player2Score.style.color = '#993C1D'
    player2Score.style.fontSize = '2rem';
    const turnInfo = document.createElement('p');
    turnInfo.style.fontSize = "14px";
    const modal = document.getElementById('name-input');
    const closeModal = document.getElementById('close-modal');

    modal.showModal();
    closeModal.disabled = true;

    player1Display.append(player1Info,player1Score);
    player2Display.append(player2Info, player2Score);
    playersTurn.append(turnInfo);

    const displayBoard = () => {
        boardElement.innerHTML = '';
        const isWinner = Game.checkWinner(board);
        const isTie = !isWinner && board.flat().every(cell => cell !== '');

        if(isWinner) {
            turnInfo.textContent = `Winner is ${Players.activePlayer.name}!`;
        } else if(isTie) {
            turnInfo.textContent = `It's a Tie!`;
        } else {
            turnInfo.textContent = `Turn: ${Players.activePlayer.name} (${Players.activePlayer.marker})`;
        }
        player1Info.textContent = `${Players.player1.name}(X)`;
        player1Score.textContent = `${Players.player1.score}`;
        player2Info.textContent = `${Players.player2.name}(0)`;
        player2Score.textContent = `${Players.player2.score}`;

        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell-button');
                cellButton.style.height = '100px';
                cellButton.style.width = '100px';
                cellButton.style.backgroundColor = '#F2F1EB';
                cellButton.style.border = '1px solid rgba(0,0,0,0.15)';
                cellButton.style.borderRadius = '10px';
                cellButton.style.fontSize = '2rem';

                cellButton.textContent = cell;

                if (cell === 'X') {
                    cellButton.style.color = '#185FA5'; // Albastru (Player 1)
                } else if (cell === '0') {
                    cellButton.style.color = '#993C1D'; // Roșu (Player 2)
                }

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

    const showModal = document.getElementById('new-match');
    const submitModal = document.getElementById('submit');

    showModal.addEventListener('click', () => {
        modal.showModal();
    });

    modal.addEventListener('close', () => {
        modalForm.reset();
        modal.close();
        submitModal.disabled = true;
    });

    closeModal.addEventListener('click', () => {
        modalForm.reset();
        modal.close();
        submitModal.disabled = true;
    });

    const modalForm = modal.querySelector(`form`);
    modalForm.addEventListener(`input`, () => {
        if(modalForm.checkValidity()) {
            submitModal.disabled = false;
        } else {
            submitModal.disabled = true;
        }
    });

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name1 = modalForm.querySelector('#player1').value;
        const name2 = modalForm.querySelector('#player2').value;

        Players.player1.name = name1;
        Players.player2.name = name2;

        closeModal.disabled = false;
        modalForm.reset();
        modal.close();
        Game.newMatch();
    });


    return {
        displayBoard,
    };
})();

GameDisplay.displayBoard();
