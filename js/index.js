// class Player {
//   constructor(name, ishuman) {
//     this.name = name;
//     // this.number = number
//     this.ishuman = ishuman; //Human or computer player
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
let diceInRoll = []; // selected dice of the roll
let dicePosition = [0, 1, 2, 3, 4]; // position of the dices to id them
let rollNumber = 0; // roll number to be able to select dice from the same roll to calculate points
let score = 0; // Score is the addition of saved points by the player
let points = 0; // Points are earned through dice throws and convert into score when sved by the player
let previousRollPoints = 0; // Record of previous points to enable points to be retroactive
let rollPoints = 0; // Points earned in a given roll

// DOM elements
const board = document.querySelector("#board");
const side = document.querySelector("#side");
const dice = document.querySelector("#dice");
const rollButton = document.querySelector("#rollButton");
const scoreButton = document.querySelector("#scorePoints");
const rulesButton = document.querySelector("#getRules");
const currentPlayerName = document.querySelector("#currentPlayerName");
const currentPlayerPoints = document.querySelector("#currentPoints");

//* PLAYGROUND (BOARD, SIDE & DICE)

// Event listeners
rollButton.addEventListener("click", rollDice);
scoreButton.addEventListener("click", scorePoints);
//todo: dice selection

function rollDice() {
  // clear the board
  dice.innerHTML = "";
  diceOnBoard = [];
  diceInRoll = [];
  // Randomize each die left on the board
  let diceToRoll = 5 - (diceOnSide.length % 5); // number of dice left to roll. Modulo enables to roll 5 new dice if all dice were
  for (let i = 0; i < diceToRoll; i++) {
    // roll the dice & add them to the board array
    const value = Math.floor(Math.random() * 6) + 1;
    diceOnBoard.push(value);
  }
  // Increment roll number to properly sum dice & reset rollPoints & previousRollPoints
  rollNumber += 1;
  rollPoints = 0;
  previousRollPoints = 0;
  // Create a roll Div to put all selected div from a same roll
  let rollDivInSide = document.createElement("div");
  rollDivInSide.className = "roll";
  rollDivInSide.setAttribute("roll", rollNumber);
  side.appendChild(rollDivInSide);
  // Create a div in the rollDivInSide to display the number of points of the selected dice in the roll
  let pointsRollDiv = document.createElement("div");
  pointsRollDiv.className = "rollPoints";
  rollDivInSide.appendChild(pointsRollDiv);
  // Display dice on the board
  showDiceOnBoard();
  // Check whether there are some points on the board or lost
  if (checkNoPointsOnBoard()) {
    // All points are lost
    rollPoints = 0;
    points = 0;
    // Display points to be null
    currentPlayerPoints.textContent = points;
    // Pause, message
    setTimeout(() => {
      window.alert("No point, you do not score. Next player");
      scorePoints(); // Passe au joueur suivant
    }, 1000);
  }
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

// Select a die from the board and show it in side
function selectDieFromBoard(evt) {
  // Remove die from the board
  const element = evt.target;
  element.remove();
  // Remove die from the board array
  let position = element.getAttribute("position");
  diceOnBoard.splice(position, 1);
  // Show the die on the side
  element.className = "die-selected"; // Change the class of the die accordingly
  element.setAttribute("roll", rollNumber); // Add the attribute roll to it
  element.style.removeProperty("transform"); // Remove the transformation of the dice
  element.style.transform += `matrix(0.3, 0, 0, 0.3, 0, 0)`; // Reapply matrix to maintain size & proportion
  // Inject die in side in the corresponding div to the roll before the points div
  let rollDiv = side.querySelector(".roll:last-of-type");
  let rollPointsDiv = rollDiv.querySelector(".rollPoints");
  rollDiv.insertBefore(element, rollPointsDiv);
  // Add selected die to the side array
  diceOnSide.push(element.getAttribute("value"));
  // Calculate the points of the selected dice in this very roll
  diceInRoll.push(Number(element.getAttribute("value"))); // Add the value of selected die to the roll array to calculate points
  rollPoints = calculatePoints(diceInRoll);
  rollPointsDiv.textContent = `${rollPoints} pts`; // Inject points in dedicated div as test
  // RollPoints are added to actual points and displayed. Previous roll points ensure that the total points evolve correctly
  points += rollPoints - previousRollPoints;
  previousRollPoints = rollPoints;
  currentPlayerPoints.textContent = points;
  // Remove eventListener
  element.removeEventListener("click", selectDieFromBoard); //todo: adapt the remove EventListener pour pouvoir remettre les dés sélectionnés par erreur
}

// Reset the board
function resetBoard() {
  diceOnBoard = [];
  diceOnSide = [];
  diceInRoll = [];
  dicePosition = [0, 1, 2, 3, 4];
  rollNumber = 0;
  dice.innerHTML = "";
  side.innerHTML = "";
  points = 0;
  rollPoints = 0;
}

// Transfer the points to Score, reset the game for the next player and call it
function scorePoints() {
  // points are added to score
  score += points;
  // points are injected to the package
  let scoreTd = document.querySelector('tr[playerName="augustin"] td.score');
  scoreTd.textContent = score;
  // Reset the board for the next player
  resetBoard();
}

//* POINTS

// Test ones and return points
function ones(diceArr) {
  const filtered1 = diceArr.filter((die) => die === 1);
  return filtered1.length * 100;
}

// Test fives and return points
function fives(diceArr) {
  const filtered1 = diceArr.filter((die) => die === 5);
  return filtered1.length * 50;
}

// Test triple and return points
function triple(diceArr) {
  let result;
  if (diceArr.length >= 3) {
    // Check the number of dice
    diceArr.sort((a, b) => a - b); // Sort the array
    for (let i = 0; i <= diceArr.length - 3; i++) {
      // Check if 3 consecutive equal values
      // console.log(
      //   "Triple " + i,
      //   diceArr[i],
      //   diceArr[i + 1],
      //   diceArr[i + 2],
      //   diceArr[i] === diceArr[i + 1],
      //   diceArr[i] === diceArr[i + 2]
      // );
      if (diceArr[i] === diceArr[i + 1] && diceArr[i] === diceArr[i + 2]) {
        // Check if 1 as triple 1 is 1000
        if (diceArr[i] === 1) {
          return (result = 1000); // If triple 1 => 1000
        } else {
          return (result = diceArr[i] * 100); // Otherwise die * 100
        }
      } else {
        result = 0; // 0 if no triple
      }
    }
  } else {
    result = 0; // O if not 3 dice
  }
  return result;
}

// Test quadruples and return points
function quadruple(diceArr) {
  let result;
  if (diceArr.length > 3) {
    // Check the number of dice
    diceArr.sort((a, b) => a - b); // Sort the array
    for (let i = 0; i <= diceArr.length - 4; i++) {
      console.log(
        "Quadruple " + i,
        diceArr[i],
        diceArr[i + 1],
        diceArr[i + 2],
        diceArr[i + 3]
      ),
        diceArr[i + 3];
      if (
        diceArr[i] === diceArr[i + 1] &&
        diceArr[i] === diceArr[i + 2] &&
        diceArr[i] === diceArr[i + 3]
      ) {
        if (diceArr[i] === 1) {
          return (result = 2000); // If triple 1 => 2000
        } else {
          return (result = diceArr[i] * 200); // Otherwise die * 200
        }
      } else {
        result = 0; // 0 if no quadruple
      }
    }
  } else {
    result = 0; // O if not 4 dice
  }
  return result;
}

// Test quintuples and return points
function quintuple(diceArr) {
  let result;
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
        if (diceArr[i] === 1) {
          result = 4000; // If triple 1 => 4000
        } else {
          result = diceArr[0] * 400; // Otherwise die * 400
        }
      } else {
        result = 0; // 0 if no quintuple
      }
    }
  } else {
    result = 0; // O if not 5 dice
  }
  return result;
}

// Test if straight => points
function straight(diceArr) {
  let result;
  if (diceArr.length === 5) {
    diceArr.sort((a, b) => a - b);
    if (
      diceArr[0] + 1 === diceArr[1] &&
      diceArr[1] + 1 === diceArr[2] &&
      diceArr[2] + 1 === diceArr[3] &&
      diceArr[3] + 1 === diceArr[4]
    ) {
      result = 500;
    } else {
      result = 0;
    }
  } else {
    result = 0;
  }
  return result;
}

// Test if there are points on the board to detect pointless rolls & end the player round
function checkNoPointsOnBoard() {
  return ones(diceOnBoard) + fives(diceOnBoard) + triple(diceOnBoard) === 0;
}

// Calculate max points for an array of dice
function calculatePoints(diceArr) {
  let diceArrPoints = 0;
  // Calculate the points of every possibility
  let onesPoints = ones(diceArr);
  let fivesPoints = fives(diceArr);
  let quintuplePoints = quintuple(diceArr);
  let quadruplePoints = quadruple(diceArr);
  let triplePoints = triple(diceArr);
  let straightPoints = straight(diceArr);

  // console.log("5x: " + quintuplePoints);
  // console.log("4x: " + quadruplePoints);
  // console.log("3x: " + triplePoints);
  // console.log("str: " + straightPoints);
  // console.log("1s: " + onesPoints);
  // console.log("5s: " + fivesPoints);

  // Identify the max combination
  const maxPoints = Math.max(
    straightPoints,
    triplePoints,
    quadruplePoints,
    quintuplePoints
  );
  // three or more 5s is a triple or more => 5s = 0
  if (fivesPoints > 100) {
    fivesPoints = 0;
  }
  // three or more 1s is a triple or more => 1s = 0
  if (onesPoints > 200) {
    onesPoints = 0;
  }
  // 1 & 5 in straight are already included in the straight => 1s & 5s = 0
  if (straightPoints > 0) {
    fivesPoints = 0;
    onesPoints = 0;
  }
  diceArrPoints += maxPoints + onesPoints + fivesPoints;
  return diceArrPoints;
}
