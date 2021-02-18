// class Player {
//   constructor(name, human) {
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

// {
//   ones: 0;        // nb of ones
//   fives: 0;       // nb of fives
//   triples: 0;     // number that is tripled
//   quadruples: 0;  // number that is quadrupled
//   quintuples:
// }

const test = [1, 2, 3, 4, 5];

function ones(arr) {
  const filtered1 = arr.filter((value) => {
    value === 1;
  });
  return filtered1.length;
}

function fives(arr) {
  const filtered5 = arr.filter((value) => {
    value === 5;
  });
  return filtered5.length;
}

function triples(arr) {
  arr.sort((a, b) => a - b);
  for (let i of arr) {
    if (arr[i] === arr[i + 1] && arr[i] === arr[i + 2]) {
      if (arr[i] === 1) {
        return arr[i] * 1000;
      } else {
        return arr[i] * 100;
      }
    }
  }
}

// Test quadruple and return value of quadruple
function quadruples(arr) {
  arr.sort((a, b) => a - b);
  for (let i of arr) {
    if (
      arr[i] === arr[i + 1] &&
      arr[i] === arr[i + 2] &&
      arr[i] === arr[i + 3]
    ) {
      if (arr[i] === 1) {
        return arr[i] * 2000;
      } else {
        arr[i] * 200;
      }
    }
  }
}

// Test quintuples and return points
function quintuples(arr) {
  if (arr.length === 5) {
    arr.sort((a, b) => a - b);
    for (let i of arr) {
      if (
        arr[i] === arr[i + 1] &&
        arr[i] === arr[i + 2] &&
        arr[i] === arr[i + 3] &&
        arr[i] === arr[i + 4]
      ) {
        if (arr[i] === 1) {
          return arr[i] * 4000;
        } else {
          arr[i] * 400;
        }
      }
    }
  }
}

// Test if straight => points
function straight(arr) {
  if (arr.length === 5) {
    arr.sort((a, b) => a - b);
    if (
      arr[0] + 1 === arr[1] &&
      arr[1] + 1 === arr[2] &&
      arr[2] + 1 === arr[3] &&
      arr[3] + 1 === arr[4]
    ) {
      return 500;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

console.log(ones(test));
console.log(fives(test));
console.log(triples(test));
console.log(quadruples(test));
console.log(quintuples(test));
console.log(straight(test));
