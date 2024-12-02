import { readFileSync } from 'fs';

const firstColumn = [];
const secondColumn = [];


//Splits the input into two columns
readFileSync( 'input.txt', 'utf8').split('\n').map(pair => pair.split(' ').map(Number)).forEach(el => {
    firstColumn.push(el[0]);
    secondColumn.push(el[el.length - 1]);
})

firstColumn.sort((a, b) => a - b);
secondColumn.sort((a, b) => a - b);


// Part 1 Calculates differences in numbers between two columns
let totalDifferenceOfAll = 0;
for (let i = 0; i < firstColumn.length; i++) {
    const pairDifference = Math.abs(firstColumn[i] - secondColumn[i]);
    totalDifferenceOfAll += pairDifference;
}



//Part 2 Calculates similarities in numbers between two columns
const similarityOccurrences = {};
firstColumn.forEach(el => {
    secondColumn.forEach(el2 => {
        if(el === el2){
            similarityOccurrences[el] = (similarityOccurrences[el] || 0) + el2;
        }
    })
})

const totalSimilarityScores = Object.values(similarityOccurrences).reduce((acc,curr) => acc + curr, 0);
