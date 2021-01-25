const express = require('express');
const path = require('path');
const app = express();

app.set('port', process.env.PORT || 3000); 

app.use((req, res, next) => {
    console.log('모든 요청에 실행하고싶어요');
    next();     // 이 함수를 실행하고 다음으로 넘겨준다.
});     //모든 요청에 실행하고 싶을때
app.get('/category/:name', (req, res) => {  // 라우트 매개변수
    res.send('hello wildcard');
    console.log(`${req.params.name}`);
});
app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});
app.use((req, res, next) => {   // 404 처리 미들웨어 -> 에러보다는 위에 라우터보다 아래
    res.send('404에러');
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});