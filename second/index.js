import fs from "fs";

const input = fs.readFileSync("input.txt", "utf8").split("\n");

let numberOfSafeInputs = 0;

const numbers = input.map((line) => {
  return line.split(" ").map(Number);
});

const allNumbersFollowOrder = (arrOfNumbers, order) => {
  const MAX_NUMBER_DIFFERENCE = 3;
  switch (order) {
    case "increasing":
      return arrOfNumbers.every((number, index) => {
        const previousNumber = arrOfNumbers[index - 1];
        if (
          index === 0 ||
          (number > previousNumber &&
            number <= previousNumber + MAX_NUMBER_DIFFERENCE)
        ) {
          return true;
        }
        return false;
      });

    case "decreasing":
      return arrOfNumbers.every((number, index) => {
        const previousNumber = arrOfNumbers[index - 1];
        if (
          index === 0 ||
          (number < previousNumber &&
            number >= previousNumber - MAX_NUMBER_DIFFERENCE)
        ) {
          return true;
        }
        return false;
      });
  }
};

const numbersOnlyIncreasingOrDecreasing = numbers.flatMap((arrOfNumbers) => {
  let decreasingNumbers = [];
  let increasingNumbers = [];

  const allNumbersIncreasing = allNumbersFollowOrder(
    arrOfNumbers,
    "increasing"
  );
  const allNumbersDecreasing = allNumbersFollowOrder(
    arrOfNumbers,
    "decreasing"
  );

  if (allNumbersIncreasing) {
    increasingNumbers.push(arrOfNumbers);
  }

  if (allNumbersDecreasing) {
    decreasingNumbers.push(arrOfNumbers);
  }

  return [...increasingNumbers, ...decreasingNumbers];
});

console.log(numbersOnlyIncreasingOrDecreasing.length);
