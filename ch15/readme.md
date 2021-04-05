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
## 1-9. pm2 소개
* Process manager 2
* 원활한 서버 운영을 위한 패키지
    * 서버가 에러로 인해 꺼졌을 때 서버를 다시 켜 줌
    * 멀티 프로세싱 지원(노드 프로세스 수를 1개 이상으로 늘릴 수 있음)
    * 요청을 프로세스들에 고르게 분배
    * 단점: 프로세스간 서버의 메모리 같은 자원 공유 불가
    * 극복: memcached나 redis같은 메모리 DB 사용(공유 메모리를 별도 DB에 저장)

## 1-10. pm2 사용하기
* pm2 전역 설치 후, 명령어 사용
    * npm i pm2
    * package.json 스크립트 수정
    * pm2 start 파일명으로 실행
```js
// package.json
"scripts": {
        "start": "cross-env NODE_ENV=production PORT=80 pm2 start server.js",
        ...
}
```
## 1-11. 프로세스 목록 확인하기
* pm2 list로 프로세스 목록 확인 가능
    * 프로세스가 백그라운드로 돌아가기 때문에 콘솔에 다른 명령어 입력 가능
    * npx pm2 list

## 1-12. pm2로 멀티 프로세싱하기
* pm2 start [파일명] –i [프로세스 수] 명령어로 멀티 프로세싱 가능
    * 프로세스 수에 원하는 프로세스의 수 입력
    * 0이면 CPU 코어 개수만큼 생성, -1이면 CPU 코어 개수보다 1개 적게 생성
    * -1은 하나의 프로세스를 노드 외의 작업 수행을 위해 풀어주는 것
```js
// package.json
"scripts": {
        "start": "cross-env NODE_ENV=production PORT=80 pm2 start server.js -i 0",
        ...
}
```
## 1-13. 서버 종료 후 멀티 프로세싱 하기
* pm2 kill로 프로세스 전체 종료 가능
    * npx pm2 kill && npm start
    * 재시작하면 프로세스가 CPU 코어 개수만큼 실행됨
## 1-14. 프로세스 모니터링하기
* pm2 monit으로 프로세스 모니터링
    * npx pm2 monit
    * 프로세스별로 로그를 실시간으로 볼 수 있음

