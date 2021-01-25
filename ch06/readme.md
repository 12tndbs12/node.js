익스프레스 웹 서버 만들기
=========================
# 1. 익스프레스 프로젝트 시작하기
## 1-1. Express 소개
* http 모듈로 웹 서버를 만들 때 코드가 보기 좋지 않고, 확장성도 떨어진다.
    * 프레임워크로 해결한다
    * 대표적인 것이 Express, Koa, Hapi가 있다. (express가 가장 많이 쓰인다.)
    * 코드 관리도 용이하고 편의성이 많이 높아진다.
* <npmtrends.com>
## 1-2. package.json 만들기
* 직접 만들거나 npm init 명령어 생성
    * nodemon이 소스 코드 변경 시 서버를 재시작해준다.
* npm i express
* npm i -D nodemon
## 1-3. app.js 작성하기
* 서버 구동의 핵심이 되는 파일이다.
    * app.set('port', 포트)로 서버가 실행될 포트를 지정한다.
    * app.get(‘주소’, 라우터)로 GET 요청이 올 때 어떤 동작을 할지 지정한다.
    * app.listen(‘포트’, 콜백)으로 몇 번 포트에서 서버를 실행할지 지정한다.
```js
const express = require('express');

const app = express();
// 이렇게 쓰면 서버에 변수를 심는다. port 변수에 3000 대입
// app.get('port')로 어디에서든 가져올 수 있다.
app.set('port', process.env.PORT || 3000);
app.get('/', (req, res) => {
    res.send('hello express');
});
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
```
## 1-4. 서버 실행하기
* app.js : 핵심 서버 스크립트이다.
* public : 외부에서 접근 가능한 파일들 모아둔다
* views : 템플릿 파일을 모아둔다.
* routes : 서버의 라우터와 로직을 모아둔다.
    * 추후에 models를 만들어 데이터베이스를 사용한다.

## 1-5. 익스프레스 서버 실행하기
* npm start 콘솔에서 실행
* nodemon이 전역적으로 설치되지 않았으면 npx nodemon app

## 1-6. HTML 서빙하기
* res.sendFile로 HTML 서빙이 가능하다.
```js
const express = require('express');
const path = require('path');
const app = express();
app.set('port', process.env.PORT || 3000);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));   // index.html에서 파일을 불러온다.

});
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});

```
# 2. 자주 사용하는 미들웨어
## 2-1. 미들웨어
* 익스프레스는 미들웨어로 구성되어 있다.
    * 요청과 응답의 중간에 위치하여 미들웨어이다.
    * app.use(미들웨어)로 장착
    * 위에서 아래로 순서대로 실행된다.
    * 미들웨어는 req, res, next가 매개변수인 함수이다.
    * req : 요청, res: 응답 조작 가능
    * next()로 다음 미들웨어로 넘어간다.
* 미들웨어가 실행되는 경우
    * app.use(미들웨어) : 모든 요청에서 미들웨어 실행
    * app.use('/abc',미들웨어) : abc로 시작하는 요청에서 미들웨어 실행
    * app.post('/abc',미들웨어) : abc로 시작하는 POST요청에서 미들웨어 실행
```js
// app.use 안에 있는 함수 자체가 미들웨어이다.
app.use((req, res, next) => {
    console.log('모든 요청에 실행하고싶어요');
    next();
});
```
## 2-2. 에러처리 미들웨어
* 에러가 발생하면 에러 처리 미들웨어로
    * err, req, res, next까지 매개변수가 4개이다. (반드시)
    * 첫번째 err에는 에러에 관한 정보가 담긴다.
    * res.status 메서드로 HTTP 상태 코드를 지정 가능하다 (기본값 200)
    * 에러 처리 미들웨어를 안 연결해도 익스프레스가 에러를 알아서 처리해주기는 한다.
        * 보안적 문제가 있기 떄문에 에러처리를 직접 해준다.
    * 특별한 경우가 아니면 가장 아래에 위치하도록 한다.
    * 한 미들웨어에서 send sendFile json을 중첩 사용하면 에러가 뜬다.
* app 생성 -> app 설정 -> 공통 미들웨어 -> 라우터 (와일드카드 같이 범위가 넓은 친구들은 아래로 배치)-> 에러 미들웨어

```js
...
app.use((req, res, next) => {
    console.log('모든 요청에 실행하고싶어요');
    next();     // 이 함수를 실행하고 다음으로 넘겨준다.
});     //모든 요청에 실행하고 싶을때
// app.get('/category/:name', (req, res) => {  // 라우트 매개변수
//     res.send('hello express');
//     console.log(`${req.params.name}`);     
// });
app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});
...
```
## 2-3. 자주 쓰는 미들웨어
* morgan, cookie-parser, express-session 설치
    * app.use로 장착
    * 내부에서 알아서 next를 호출해서