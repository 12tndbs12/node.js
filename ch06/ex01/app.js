const express = require('express');
const path = require('path');
const app = express();

// 이렇게 쓰면 서버에 변수를 심는다. port 변수에 3000 대입
// app.get('port')로 어디에서든 가져올 수 있다.
app.set('port', process.env.PORT || 3000); 

/*
    1-4까지
app.get('/', (req, res) => {
    res.send('hello express');
});
*/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));   // index.html에서 파일을 불러온다.
});
app.post('/', (req, res) => {
    res.send('hello express');
});
app.get('/about', (req, res) => {
    res.send('hello express');
});

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});