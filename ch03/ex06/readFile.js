const fs = require('fs').promises;  // 뒤에 .promises를 붙이면 자동으로 프로미스 지원
// const fs = require('fs');
// fs.readFile('./readme.txt', (err, data) => {
//     if (err) {
//         throw err;
//     }
//     console.log(data);
//     console.log(data.toString());
// });

fs.readFile('./readme.txt')
    .then((data)=> {
        console.log(data);
        console.log(data.toString());
    })
    .catch((err) => {
        throw err;
    });