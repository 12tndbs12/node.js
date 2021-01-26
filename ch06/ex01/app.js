const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();


app.set('port', process.env.PORT || 3000); 

app.use(morgan('combined'));
app.use(cookieParser());
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/', (req, res) => {
    res.send('hello express!');
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