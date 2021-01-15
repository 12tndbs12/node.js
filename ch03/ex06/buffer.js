const buffer = Buffer.from('저를 버퍼로 바꿔보세요.');
console.log(buffer);
console.log(buffer.length);
console.log(buffer.toString());

// 버퍼 합치기
const array = [Buffer.from('띄엄 '), Buffer.from('띄엄 '), Buffer.from('띄어쓰기')];
console.log(Buffer.concat(array).toString());

// 버퍼 만들기
console.log(Buffer.alloc(5));