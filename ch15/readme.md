AWS로 배포하기
==============
# 1.서비스 운영을 위한 패키지
## 1-1. 실 서비스 배포 준비하기
* 서비스 개발 시에는 localhost로 결과를 바로 볼 수 있었음
    * 혼자만 볼 수 있기에 다른 사람에게 공개하는 과정이 필요
    * 9장 NodeBird 앱을 배포해볼 것임
* 배포를 위한 사전 작업 방법에 대해 알아봄
    * 서버 실행 관리, 에러 내역 관리, 보안 위협 대처
    * AWS와 GCP에 배포
## 1-2. morgan
* 개발용으로 설정된 익스프레스 미들웨어를 배포용으로 전환
    * process.env.NODE_ENV는 배포 환경인지 개발 환경인지를 판단할 수 있는 환경 변수
    * 배포 환경일 때는 combined 사용(더 많은 사용자 정보를 로그로 남김)
    * NODE_ENV는 뒤에 나오는 cross-env에서 설정해줌
```js
if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}
```
## 1-3. express-session
* 설정들을 배포용과 개발용으로 분기 처리
    * production일 때는 proxy를 true, secure를 true로
    * 단, https를 적용할 경우에만 secure를 true로 하고, 노드 앞에 다른 서버를 두었을 때 proxy를 true로 함
```js
// 개발용 옵션
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
};
// 배포용 옵션으로 바꿔줌
if(process.env.NODE_ENV === 'production'){
    sessionOption.proxy = true;
    // https를 적용 했다면
    // sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));
```
* 프록시서버를 쓴다면 아래 코드를 추가하면 좋다.
```js
// app.js
...
passportConfig():
app.enable('trust proxy');
...
```
## 1-4. sequelize
* 시퀄라이즈 설정도 하드코딩 대신 process.env로 변경
    * JSON 파일은 변수를 사용할 수 없으므로 JS 파일을 설정 파일로 써야 함
    * config.json을 지우고 config.js 사용
```js
// config/config.js
require('dotenv').config();

module.exports = {
    development: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "nodebird",
        host: "127.0.0.1",
        dialect: "mysql"
    },
    "test": {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "nodebird",
        host: "127.0.0.1",
        dialect: "mysql"
    },
    "production": {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "nodebird",
        host: "127.0.0.1",
        dialect: "mysql"
    }
}
// .env
COOKIE_SECRET=nodebirdsecret
KAKAO_ID=123454646775465rfdgds
SEQUELIZE_PASSWORD=데이터베이스 비밀번호
```
## 1-5. cross-env
* 동적으로 process.env 변경 가능
    * 운영체제 상관 없이 일괄 적용 가능(맥, 윈도, 리눅스)
    * package.json을 다음과 같이 수정(배포용과 개발용 스크립트 구분)
    * 문제점: 윈도에서는 NODE_ENV를 아래와 같이 설정할 수 없음
    * 이 때 cross-env가 필요
```json
{
    "name": "nodebird",
    "version": "0.0.1",
    "description": "익스프레스로 만드는 SNS 서비스",
    "main": "server.js",
    "scripts": {
        "start": "NODE_ENV=production PORT=80 node server",
        "dev": "nodemon serever",
        "test": "jest"
    },
}
```
## 1-6. cross-env
* cross-env 설치 후 적용
    * npm i cross-env
    * package.json도 수정
```json
"scripts": {
        "start": "cross-env NODE_ENV=production PORT=80 node server",
        ...
        }
```
## 1-7. sanitize-html
* XSS(Cross Site Scripting) 공격 방어
    * npm i sanitize-html
    * 허용하지 않은 html 입력을 막음
    * 아래처럼 빈 문자열로 치환됨
```js
const sanitizeHtml = require('sanitize-html');

const html = "<script>location.href = 'https://gilbut.co.kr'</script>";
console.log(sanitizeHtml(html));    // ''
```
## 1-8. csurf
* CSRF(Cross Site Request Forgery) 공격 방어
    * npm i csurf
    * csrfToken을 생성해서 프런트로 보내주고(쿠키로)
    * Form 등록 시 csrfToken을 같이 받아 일치하는지 비교
```js
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
    res.render('csrf', { csrfToken: req.csrfToken() });
});

app.post('/form', csrfProtection, (req, res) => {
    res.send('OK');
});
```
