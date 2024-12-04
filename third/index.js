import fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf8');


const calculateNumbers = (input) => {
    let sum = 0;
    let enabled = true; 
    
    const tokens = input.match(/(mul\(\d+,\d+\)|do\(\)|don't\(\))/g) || [];
    tokens.forEach(token => {
        if (token === 'do()') {
            enabled = true;
        } else if (token === "don't()") {
            enabled = false;
        } else if (enabled && token.startsWith('mul')) {
            const [_, a, b] = token.match(/mul\((\d+),(\d+)\)/);
            sum += parseInt(a) * parseInt(b);
        }
    });
    return sum;
}

console.log(calculateNumbers(input));