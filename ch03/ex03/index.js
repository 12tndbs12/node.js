const {odd ,even} = require('./var');
const checkNumber = require('./func');

function checkStringOddOrEven(str) {
    if (str.length % 2) {
        return odd;
    } else {
        return even;
    }
}

console.log(checkNumber(10));
console.log(checkStringOddOrEven('hello'));

// 터미널에 node index 입력