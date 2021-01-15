const fs = require('fs');
// createReadStream은 한번에 64KB 씩 읽기 떄문에 
// highWaterMark를 사용해서 16byte 씩 읽게 설정 해준다.
const readStream = fs.createReadStream('./readme3.txt', {highWaterMark : 16});

const data = [];
readStream.on('data', (chunk) => {
    data.push(chunk);
    console.log('data : ', chunk, chunk.length);
});
readStream.on('end', () => {
    console.log('end :', Buffer.concat(data).toString());
});
readStream.on('error', () => {
    console.log('error :', err);
});