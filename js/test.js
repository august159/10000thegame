// Test ones and return points
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

const test = [1, 1, 1, 1, 1];

console.log(quintuple(test));
