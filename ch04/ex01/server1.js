const http = require('http');

// const server = http.createServer((req,res) => {
//     res.write('<h1>Hello Node!</h1>');
//     res.write('<p>Hello server</p>');
//     res.end('<p>Hello Me</p>');
// })
//     .listen(8080, () => {
//         console.log('8080번 포트에서 서버 대기 중입니다.');
//     });

const server = http.createServer((req,res) => {
    // HTML 명시
    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
    res.write('<h1>Hello Node!</h1>');
    res.write('<p>Hello server</p>');
    res.end('<p>Hello Me</p>');
})
.listen(8080);
//  listen 콜백함수를 밖으로 뺴는 경우
server.on('listening', () => {
    console.log('8080번 포트에서 서버 대기 중입니다.');
});
// 에러처리
server.on('error', (error) => {
    console.error(error);
});
// 주소창에 http://localhost:8080/

