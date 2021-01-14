const fs = require('fs').promises;

async function main() {
    let data = await fs.readFile('./readme.txt');
    console.log('1번', data.toString());
    data = await fs.readFile('./readme.txt');
    console.log('2번', data.toString());
    data = await fs.readFile('./readme.txt');
    console.log('3번', data.toString());
    data = await fs.readFile('./readme.txt');
    console.log('4번', data.toString());
}
main();
// async/await을 사용하지 않은 경우
// fs.readFile('./readme.txt')
//     .then((data)=> {
//         console.log('1번', data.toString());
//         return fs.readFile('./readme.txt')
//     })
//     .then((data)=> {
//         console.log('2번', data.toString());
//         return fs.readFile('./readme.txt')
//     }).then((data)=> {
//         console.log('3번', data.toString());
//         return fs.readFile('./readme.txt')
//     }).then((data)=> {
//         console.log('4번', data.toString());
//         return fs.readFile('./readme.txt')
//     })
//     .catch((err) => {
//         throw err;
//     });