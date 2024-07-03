/*
** The Gameboard represents the state of the board
** Each equare holds a Cell (defined later)
** and we expose a markToken method to be able to add Cells to squares
*/

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    // Create a 2d array that will represent the state of the game board
    // For this 2d array, row 0 will represent the top row and
    // column 0 will represent the left-most column.
    // This nested-loop technique is a simple and common way to create a 2d array.
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  
    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;
  
    // In order to drop a token, we need to find what the player 
    // selected as a row and column *then* change that cell's value to the player number
    const markToken = (row, column, player) => {
      
        // If no cells make it through the filter, 
        // the move is invalid. Stop execution.
        if(board[row][column].getValue() !== 0) return;

        // Otherwise, I have a valid cell, 
        board[row][column].addToken(player);
      
    };

    const checkWinner = (row, column, player) => {

        // if one element stays true after checking then it's a win
        let winner =[true, true, true, true];
        let counter = 0;

        // Check column
        for(let j=0; j< columns; j++){
            if(board[row][j].getValue() !== player){
             winner[0] = false;
            }
        }
        // Check row
        for(let i=0; i< rows; i++){
            if(board[i][column].getValue() !== player){
             winner[1] = false;
            }
        }
        // check diagonal
        for(let i=0;i<rows;i++){
            if(board[i][i].getValue() !== player){
                winner[2] = false;
            }
        }
        // check inverse diagonal
        for(let j = columns-1; j>=0; j--){
            if(board[counter][j].getValue() !== player){
                winner[3] = false;
            }
            counter++;
        }
        return winner.includes(true)
    }
  
    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      console.log(boardWithCellValues);
    };
  
    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, markToken, checkWinner, printBoard };
  }
  
  /*
  ** A Cell represents one "square" on the board and can have one of
  ** 0: no token is in the square,
  ** 1: Player One's token,
  ** 2: Player 2's token
  */
  
  function Cell() {
    let value = 0;
  
    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
      value = player;
    };
  
    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;
  
    return {
      addToken,
      getValue
    };
  }
  
  /* 
  ** The GameController will be responsible for controlling the 
  ** flow and state of the game's turns, as well as whether
  ** anybody has won the game
  */
  function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board = Gameboard();
  
    const players = [
      {
        name: playerOneName,
        token: 1
      },
      {
        name: playerTwoName,
        token: 2
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
  
    const playRound = (row, column) => {
      // Mark a token for the current player
      console.log(
        `Marking ${getActivePlayer().name}'s token into row ${row}, column ${column}...`
      );
      board.markToken(row, column, getActivePlayer().token);
  
      board.checkWinner(row, column, getActivePlayer().token);
  
      // Switch player turn
      switchPlayerTurn();
      printNewRound();
    };
  
    // Initial play game message
    printNewRound();
  
    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version, so I'm revealing it now
    return {
      playRound,
      getActivePlayer
    };
  }
  
  const game = GameController();