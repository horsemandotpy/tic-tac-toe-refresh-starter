const Screen = require("./screen");
const Cursor = require("./cursor");
const { render } = require("./screen");

class TTT {
  constructor() {
    this.playerTurn = "O";

    this.grid = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];

    this.cursor = new Cursor(3, 3);

    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(3, 3);
    Screen.setGridlines(true);
    this.cursor.setBackgroundColor();

    // Replace this with real commands
    Screen.addCommand("t", "test command (remove)", TTT.testCommand);
    Screen.addCommand("up", "move cursor up", this.cursor.up.bind(this.cursor));
    Screen.addCommand(
      "right",
      "move cursor right",
      this.cursor.right.bind(this.cursor)
    );
    Screen.addCommand(
      "left",
      "move cursor left",
      this.cursor.left.bind(this.cursor)
    );
    Screen.addCommand(
      "down",
      "move cursor down",
      this.cursor.down.bind(this.cursor)
    );

    //Create a command in ttt.js that places a move at the cursor's position
    Screen.addCommand(
      "return",
      "place move at cursor position",
      TTT.placeMove.bind(this)
    );

    Screen.addCommand("r", "reset the game", TTT.resetGame.bind(this));


    Screen.render();

    console.log(
      `Welcome to Tic-Tac-Toe. The players are X and O. The first player is ${this.playerTurn}.`
    );
    Screen.printCommands();
  }

  setPlayerTurn(turn) {
    this.playerTurn = turn;
    Screen.setMessage(`Player ${this.playerTurn}'s move.`);
  }

  static placeMove() {
    // What is bind doing exactly in addCommand above?
    Screen.render();
    // Why couldn't I  do below this.grid
    if (Screen.grid[this.cursor.row][this.cursor.col] === " ") {
      this.cursor.return(this.playerTurn);
      if (this.playerTurn === "O") {
        this.playerTurn = "X";
      } else {
        this.playerTurn = "O";
      }

      Screen.render();
      let winner = TTT.checkWin(Screen.grid);
      if (winner) {
        TTT.endGame(winner);
      }
    } else {
      Screen.setMessage(
        "That space is already occupied. Choose another space."
      );
      Screen.render();
    }
  }

  // Remove this
  static testCommand() {
    console.log("TEST COMMAND");
  }

  // Make a helper check horizontal win
  // Check if every space in a row is the same
  // If true return any space in that row
  // Else return false
  static horizontalCheck(grid) {
    let win = grid.find((row) =>
      row.every((space) => row[0] === space && space != " ")
    );
    if (win) {
      return win[0];
    } else {
      return false;
    }
  }

  // Make a helper check vertical win
  // Set a winning letter
  // The first letter that equal to all it in col is win
  // Return winning letter
  // Else return false
  static verticalCheck(grid) {
    let winningLetter;
    for (let col = 0; col < grid[0].length; col++) {
      winningLetter = grid[0][col];
      if (
        winningLetter === grid[1][col] &&
        winningLetter === grid[2][col] &&
        winningLetter !== " "
      ) {
        return winningLetter;
      }
    }

    return false;
  }

  // Make a helper check diagonal win
  // Make sure it's not empty space
  // Check the first and the last slope line
  // If either true return first middle space
  // Else return false
  static diagonalCheck(grid) {
    if (
      grid[0][0] === grid[1][1] &&
      grid[0][0] === grid[2][2] &&
      grid[1][1] !== " "
    ) {
      return grid[1][1];
    } else if (
      grid[0][2] === grid[1][1] &&
      grid[0][2] === grid[2][0] &&
      grid[1][1] !== " "
    ) {
      return grid[1][1];
    } else {
      return false;
    }
  }

  static checkWin(grid) {
    const emptyGrid = grid.every((space) =>
      space.every((item) => item === " ")
    );
    const fullGrid = grid.every((space) => space.every((item) => item !== " "));

    if (emptyGrid) {
      return false;
    }

    if (fullGrid) {
      return "T";
    }

    return (
      TTT.horizontalCheck(grid) ||
      TTT.diagonalCheck(grid) ||
      TTT.verticalCheck(grid)
    );

    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    // Return false if the game has not ended
  }

  static resetGame() {
    Screen.initialize(3, 3);
    Object.keys(Screen.commands).forEach((cmd) => {
      if (!["r", "q"].includes(cmd)) {
        Screen.activateCommand(cmd);
      }
    });
    this.setPlayerTurn("O");
    Screen.render();
  }

  static endGame(winner) {
    if (winner === "O" || winner === "X") {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === "T") {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }
}

module.exports = TTT;
