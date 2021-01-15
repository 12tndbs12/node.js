const fs = require('fs');
const zlib = require('zlib');

// readme에서 16바이트씩 읽어서 writeStream으로 16바이트씩 써준다.
// 파일 복사
// const readStream = fs.createReadStream('./readme3.txt', {highWaterMark : 16});
// const writeStream = fs.createWriteStream('./writeme3.txt');
// readStream.pipe(writeStream);

const readStream = fs.createReadStream('./readme3.txt', {highWaterMark : 16});
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream('./writeme4.txt.gz');
readStream.pipe(zlibStream).pipe(writeStream);