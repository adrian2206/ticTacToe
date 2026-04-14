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

    return {
        getBoard,
    }
    })();

const Players = (function() {
    const createPlayer = function(name, marker) {
        return {name, marker};
    }

    const player1 = createPlayer('name1', 'X');
    const player2 = createPlayer('name2', '0');

    let activePlayer = player1;
    const switchPlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    return {
        player1,
        player2,
        get activePlayer() {return activePlayer;},
        switchPlayer,
    }
})();

const Game = (function() {
        const board = Gameboard.getBoard();

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
        if(board[i][j] === '') {
            board[i][j] = Players.activePlayer.marker;
            if(checkWinner(board)) {
                console.log(`Winner is ${Players.activePlayer.name}`);
                return;
            }

            if(board.flat().every(cell => cell != '')){
                console.log(`Tie`);
                return;
            }

            Players.switchPlayer();

            console.log('Successful move!');
        } else {
            console.log('Cell is already filled!')
        }
    }

    return {
        makeMove,
    };
})();
