/*
** The Gameboard represents the state of the board
** Each square holds a Cell (defined later)
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
    // selected as a row and column *then* change that cell's value to the player token
    const markToken = (row, column, player) => {
      
        // If no cells make it through the filter, 
        // the move is invalid. Stop execution.
        if(board[row][column].getValue() !== '') return;

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

        return winner.includes(true);
    }

    const checkEmpty = (row, column) => board[row][column].getValue() === '';
  
    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, markToken, checkWinner, checkEmpty };
  }
  
  /*
  ** A Cell represents one "square" on the board and can have one of
  ** '': no token is in the square,
  ** X: Player One's token,
  ** O: Player 2's token
  */
  
  function Cell() {
    let value = '';
  
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
        token: "X"
      },
      {
        name: playerTwoName,
        token: "O"
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const playRound = (row, column) => {
      if(board.checkEmpty(row, column)){
        // Mark a token for the current player
        console.log(
          `Marking ${getActivePlayer().name}'s token into row ${row}, column ${column}...`
        );
        board.markToken(row, column, getActivePlayer().token);


        if(board.checkWinner(row, column, getActivePlayer().token)){
          return getActivePlayer().name;
        }

        if(board.getBoard().flat().every(cell => cell.getValue() !== '')){
          return true;
        }
        
        // Switch player turn
        switchPlayerTurn();
        return
      }
    };
  
    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version, so I'm revealing it now
    return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard
    };
  }
  
  function ScreenController() {
    let game = GameController();
    const container = document.querySelector('.container');
    const playerTurnDiv = document.querySelector('.turn');
    const resultDiv = document.querySelector('.result');
    const boardDiv = document.querySelector('.board');
    const firstPlayer = document.getElementById('firstPlayer');
    const secondPlayer = document.getElementById('secondPlayer');
    const form = document.getElementById('form');

  
    const updateScreen = (result) => {
      // clear the board
      boardDiv.textContent = "";
      boardDiv.style.visibility = "visible";
      
      // get the newest version of the board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
  
      // Display player's turn
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

      if(result) {
        (result === true)? resultDiv.textContent = "It's a Tie" : resultDiv.textContent = `The winner is ${result}`;
        const restartButton = document.createElement("button");
        restartButton.classList.add("restart");
        restartButton.textContent = "Play Again";
        container.appendChild(restartButton);
        restartButton.addEventListener('click', () => {
          location.reload();
          return false;
        });
        boardDiv.removeEventListener("click", clickHandlerBoard);
      }
      // Render board squares
      board.forEach((row, i) => {
        row.forEach((cell, j) => {
          // Anything clickable should be a button!!
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          // Create a data attribute to identify the column
          // This makes it easier to pass into our `playRound` function 
          cellButton.dataset.row = i;
          cellButton.dataset.column = j;
          cellButton.textContent = cell.getValue();
          boardDiv.appendChild(cellButton);
        })
      })
    }
  
    form.addEventListener('submit', (e) => {
      game = GameController(firstPlayer.value, secondPlayer.value);
      form.textContent = "";
      updateScreen();
      e.preventDefault();
    })

    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedRow = e.target.dataset.row;
      const selectedColumn = e.target.dataset.column;
      const result = game.playRound(selectedRow, selectedColumn);
      updateScreen(result);
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    // updateScreen();

    boardDiv.style.visibility = "hidden";
  
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
  }
  
  ScreenController();