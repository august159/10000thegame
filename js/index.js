// class Player {
//   constructor(name, ishuman) {
//     this.name = name;
//     // this.number = number
//     this.human = human; //Human or computer player
//     this.score = 0;
//     this.points = 0; // points at stake before the player decides to score those points
//     this.sticks = 0; // number of rounds a player did not score consecutively
//     this.isOut = false; // has the player scored the minimum 650pts in one round to start scoring ?
//     this.isActive = false; // is it the player turn ?
//     this.scoredDice = []; // set of dice that has been put away to score
//   }

//   // throwDice
//   // secureDie
//   // hasPoints
//   // score
//   // hasWon
// }

let diceOnBoard = []; // dice on the board
let diceOnSide = []; // selected dice on the side
let dicePosition = [0, 1, 2, 3, 4]; // position of the dices to id them
let rollNumber = 0; // roll number to be able to select dice from the same roll to calculate points
let points = 0;

// DOM elements
const board = document.querySelector("#board");
const side = document.querySelector("#side");
const dice = document.querySelector("#dice");
const rollButton = document.querySelector("#rollButton");
const scoreButton = document.querySelector("#scorePoints");
const rulesButton = document.querySelector("#getRules");
const currentPlayerName = document.querySelector("#currentPlayerName");
const currentPlayerPoints = document.querySelector("#currentPlayerPoints");
const currentPoints = document.querySelector("#currentPoints");

// Event listeners
rollButton.addEventListener("click", rollDice);
scoreButton.addEventListener("click", scorePoints); //todo: write the functions
//todo: dice selection

//* DOM PART

function rollDice() {
  dice.innerHTML = ""; // clear the board
  diceOnBoard = [];

  let diceToRoll = 5 - diceOnSide.length; // number of dice left to roll
  for (let i = 0; i < diceToRoll; i++) {
    // roll the dice & add them to the board array
    const value = Math.floor(Math.random() * 6) + 1; // randomize a number in [1-6]
    diceOnBoard.push(value);
  }

  rollNumber += 1;

  let rollDivInSide = document.createElement("div");
  rollDivInSide.className = "roll";
  rollDivInSide.setAttribute("roll", rollNumber);
  side.appendChild(rollDivInSide);

  let pointsDiv = document.createElement("div");
  pointsDiv.className = "points";

  showDiceOnBoard();
}

// Show the dice after pressing roll buttons
function showDiceOnBoard() {
  dicePosition = [0, 1, 2, 3, 4]; // Reset the dice position

  for (let i = diceOnBoard.length - 1; i >= 0; i--) {
    showDieOnBoard(diceOnBoard[i], dicePosition[i]);
  }
}

// Show a die on board
function showDieOnBoard(value, position) {
  let dieDiv = document.createElement("div");
  dieDiv.className += "die";
  dieDiv.setAttribute("value", value);
  dieDiv.setAttribute("position", position);

  let rotation = Math.floor(Math.random() * 360) + 1; // Add random rotation to transform styles
  let transformation = `matrix(0.3, 0, 0, 0.3, 0, 0) rotate(${rotation}deg)`;
  dieDiv.style.transform += transformation;

  dice.appendChild(dieDiv);
  dieDiv.addEventListener("click", selectDieFromBoard);
}

// Select a die from the diceOnBoard
function selectDieFromBoard(evt) {
  const element = evt.target;
  element.remove(); // Remove the dice from the board

  let position = element.getAttribute("position"); // Remove die from the board array
  diceOnBoard.splice(position, 1);

  element.className = "die-selected"; // Change the class of the die accordingly
  element.setAttribute("roll", rollNumber); // Add the attribute roll to it
  element.style.removeProperty("transform"); // Remove the transformation of the dice
  element.style.transform += `matrix(0.3, 0, 0, 0.3, 0, 0)`; // Reapply matrix to maintain size & proportion

  let rollDiv = side.querySelector(".roll:last-of-type"); // Inject dice in side in the corresponding div to the roll
  rollDiv.appendChild(element);

  diceOnSide.push(element.getAttribute("value")); // Add selected die to the table array
  console.log(diceOnSide);
  element.removeEventListener("click", selectDieFromBoard);
}

// Reset the board
function resetBoard() {
  diceOnBoard = [];
  diceOnSide = [];
  dicePosition = [0, 1, 2, 3, 4];
  roll = 0;
  board.innerHTML = "";
  side.innerHTML = "";
}

//* POINTS

function ones(diceArr) {
  const filtered1 = diceArr.filter((die) => die === 1);
  if (filtered1.length > 2) {
    // If more than 2 1s then triple should apply
    return 0;
  } else {
    return filtered1.length * 100;
  }
}

function fives(diceArr) {
  const filtered1 = diceArr.filter((die) => die === 5);
  if (filtered1.length > 2) {
    // If more than 2 5s then triple should apply
    return 0;
  } else {
    return filtered1.length * 50;
  }
}

// Test triple and return points
function triple(diceArr) {
  if (diceArr.length >= 3) {
    // Check the number of dice
    diceArr.sort((a, b) => a - b); // Sort the array
    for (let i = 0; i < 3; i++) {
      if (diceArr[i] === diceArr[i + 1] && diceArr[i] === diceArr[i + 2]) {
        // Check if 3 consecutive equal values
        if (diceArr[i] === 1) {
          return diceArr[i] * 1000; // If triple 1 => 1000
        } else {
          return diceArr[i] * 100; // Otherwise die * 100
        }
      } else {
        return 0; // 0 if no triple
      }
    }
  } else {
    return 0; // O if not 3 dice
  }
}

// Test quadruples and return points
function quadruple(diceArr) {
  if (diceArr.length >= 4) {
    // Check the number of dice
    diceArr.sort((a, b) => a - b); // Sort the array
    for (let i = 0; i < 2; i++) {
      if (
        diceArr[i] === diceArr[i + 1] &&
        diceArr[i] === diceArr[i + 2] &&
        diceArr[i] === diceArr[i + 3]
      ) {
        if (diceArr[i] === 1) {
          return 2000; // If triple 1 => 2000
        } else {
          return diceArr[i] * 200; // Otherwise die * 200
        }
      } else {
        return 0; // 0 if no quadruple
      }
    }
  } else {
    return 0; // O if not 4 dice
  }
}

// Test quintuples and return points
function quintuple(diceArr) {
  if (diceArr.length === 5) {
    // Check the number of dice
    diceArr.sort((a, b) => a - b); // Sort the array
    for (let i of diceArr) {
      if (
        diceArr[0] === diceArr[1] &&
        diceArr[0] === diceArr[2] &&
        diceArr[0] === diceArr[3] &&
        diceArr[0] === diceArr[4]
      ) {
        // Check if 4 consecutive equal values
        if (diceArr[i] === 1) {
          return diceArr[i] * 4000; // If triple 1 => 4000
        } else {
          return diceArr[i] * 400; // Otherwise die * 400
        }
      } else {
        return 0; // 0 if no quintuple
      }
    }
  } else {
    return 0; // O if not 5 dice
  }
}

// Test if straight => points
function straight(diceArr) {
  if (diceArr.length === 5) {
    diceArr.sort((a, b) => a - b);
    if (
      diceArr[0] + 1 === diceArr[1] &&
      diceArr[1] + 1 === diceArr[2] &&
      diceArr[2] + 1 === diceArr[3] &&
      diceArr[3] + 1 === diceArr[4]
    ) {
      return 500;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}
