import fs from "fs";
import { isValidSequence } from "./isValidSequence.js";
const input = fs.readFileSync("input.txt", "utf8").split("\n");


const numbers = input.map((line) => {
  return line.split(" ").map(Number);
});


// Both solutions =>  stole from internet -_-
const numbersOnlyIncreasingOrDecreasing = numbers.map((arrOfNumbers) => {
  if(isValidSequence(arrOfNumbers)) return arrOfNumbers;
}).filter(Boolean);

console.log(numbersOnlyIncreasingOrDecreasing.length);