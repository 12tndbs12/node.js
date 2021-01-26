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
    * 내부에서 알아서 next를 호출해서 다음 미들웨어로 넘어간다.
    * npm i morgan cookie-parser express-session
```js
// app.js
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000); 

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));   // 찾으면 끝 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));    // true 추천 qs, false면 querystring
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));
app.use((req, res, next) => {
  console.log('모든 요청에 다 실행된다.');
  next();
});
...
```
```js
// .env
COOKIE_SECRET=cookiesecret
```
## 2-4. dotenv
* env 파일을 읽어서 process.env로 만든다.
    * process.env.COOKIE_SECRET에 cookiesecret 값이 할당됨(키=값 형식)
    * 비밀 키들을 소스 코드에 그대로 적어두면 소스 코드가 유출되었을 때 비밀 키도 같이 유출되기 때문에 쓴다.
    * .env 파일에 비밀 키들을 모아두고 .env 파일만 잘 관리하면 된다.

## 2-5. morgan
* 서버로 들어온 요청과 응답을 기록해주는 미들웨어이다.
    * 로그로 자세한 정도를 선택할 수 있다. (dev, tiny, short, common, combined)
    * ex) app.use(morgan('dev'));
    * 개발환경에서는 dev, 배포환경에서는 combined를 애용한다.
    * 더 자세한 로그를 위해 winston 패키지를 사용한다.

## 2-6. static
* 정적인 파일들을 제공하는 미들웨어이다.
    * 인수로 정적 파일의 경로를 제공한다.
    * 파일이 있을 때 fs.readFile로 직접 읽을 필요가 없다.
    * 요청하는 파일이 없으면 알아서 next를 호출해서 다음 미들웨어로 넘어간다.
    * 파일을 발견했다면 다음 미들웨어는 실행되지 않는다.
```js
app.use('요청 경로', express.static('실제 경로'));
app.use('/', express.static(path.join(__dirname, 'public')));
```
* 컨텐츠 요청 주소와 실제 컨텐츠의 경로를 다르게 만들 수 있다.
    * 요청 주소 localhost:3000/stylesheets/style.css
    * 실제 컨텐츠 경로 /public/stylesheets/style.css
    * 서버의 구조를 파악하기 어려워져서 보안에 도움이 됨

```js
```

## 2-7. body-parser
* 요청의 본문을 해석해주는 미들웨어이다.
    * 폼 데이터나 AJAX 요청의 데이터를 처리한다.
    * json 미들웨어는 요청 본문이 json인 경우 해석, urlencoded 미들웨어는 폼 요청을 해석한다.
    * put이나 patch, post 요청 시에 req.body에 프런트에서 온 데이터를 넣어준다.
```js
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
```
* 버퍼 데이터나 text 데이터일 때는 body-parser를 직접 설치해야 한다.
```js
//콘솔
npm i body-parser
// js
const bodyParser = require('body-parser');
app.use(bodyParser.raw());      // 버퍼
app.use(bodyParser.text());     // text
```
* multipart 데이터인 경우는 다른 미들웨어를 사용해야 한다.
    * multer 패키지
## 2-8. cookie-parser
* 요청 헤더의 쿠키를 해석해주는 미들웨어이다.
    * 4-3 cookies.js 참조
    * parseCookies 함수와 기능이 비슷하다.
    * req.cookies 안에 쿠키들이 들어있다.
    * 비밀키로 쿠키 뒤에 서명을 붙여 내 서버가 만든 쿠키임을 검증할 수 있다.
        * req.signedCookies;
```js
app.use(cookieParser(비밀키));
```
* 실제 쿠키 옵션들을 넣을 수 있다.
    * expires, domain, httpOnly, maxAge, path, secure, sameSite 등
    * 지울 때는 clearCookie로 지운다. (expires와 maxAge를 제외한 옵션들이 일치해야 한다.)
```js
req.cookies // {mycookie: 'test'}처럼 쿠키를 가져온다
// 'Set-Cookie' : `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
res.cookie('name', 'zerocho', {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
    secure: true,
});
// 쿠키 지우기
res.clearCookie('name', 'zerocho', {
    httpOnly: true,
    secure: true,
});
```

## 2-9. express-session
* 세션 관리용 미들웨어이다.
    * req.session 자체가 사용자의 고유한 세션
    * 세션 쿠키에 대한 설정(secret: 쿠키 암호화, cookie: 세션 쿠키 옵션)
    * 세션 쿠키는 앞에 s%3A가 붙은 후 암호화되어 프런트에 전송된다.
    * resave: 요청이 왔을 때 세션에 수정사항이 생기지 않아도 다시 저장할지 여부
    * saveUninitialized: 세션에 저장할 내역이 없더라도 세션을 저장할지
    * req.session.save로 수동 저장도 가능하지만 할 일 거의 없다.
* express-session은 세션 관리 시 클라이언트에 쿠키를 보낸다.
    * 이를 세션 쿠키 라고 부른다.
    * 안전하게 쿠키를 전송하려면 쿠키에 서명을 추가해야 하고, 쿠키를 서명하는데 secret의 값이 필요하다.
    * cookie-parser의 secret과 같게 설정해야 한다.

```js
const session = require('express-session');

app.use(cookieParser('secret code'));
app.use(session({
    resave: false,      //보통 false
    saveUninitialized: false,       //보통 false
    secret: 'secret code',
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
```
```js
req.session.name = 'zerocho'; //세션 등록
req.sessionID;  // 세션 아이디 확인
req.session.destroy(); // 세션 모두 제거
```
## 2-10. 미들웨어의 특성
* req, res, next를 매개변수로 가지는 함수이다.
* 익스프레스 미들웨어들도 다음과 같이 축약이 가능하다.
    * 순서가 중요하다.
    * static 미들웨어에서 파일을 찾으면 next를 호출 안 하므로 json, urlencoded, cookieParser는 실행되지 않는다.
```js
app.use(
    morgan('dev'),
    express.static('/', path.join(__dirname, 'public')),
    express.json(),
    express.urlencoded({ extended: false}),
    cookieParser(process.env.COOKIE_SECRET),
);
```
## 2-11. next
* next를 호출해야 다음 코드로 넘어간다.
    * next를 빼면 다음 미들웨어(라우터 미들웨어)로 넘어가지 않기 때문이다.
    * next에 인수로 값을 넣으면 에러 핸들러로 넘어간다.('route'인 경우는 다음 라우터로 넘어간다.)
## 2-12. 미들웨어간 데이터 전달하기
* req나 res 객체 안에 값을 넣어 데이터를 전달 가능하다.
    * app.set과의 차이점 : app.set은 서버 내내 유지되고, req,res는 요청 하나 동안만 유지된다.
    * req.body나 req.cookies같은 미들웨어의 데이터와 겹치지 않게 조심하자
```js
app.use((req,res,next) => {
    req.data = '데이터 넣기'
    next();
},(req, res, next) => {
    console.log(req.data);  //데이터 받기
    next();
});
```

## 2-13. 미들웨어 확장하기
* 미들웨어 안에 미들웨어를 넣는 방법
    * 아래 두 코드는 동일한 역할이다.
```js
app.use(morgan('dev'));
// 또는
app.use((req, res, next) => {
    morgan('dev')(req, res, next);
});
```
* 아래처럼 다양하게 활용이 가능하다.
```js
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        morgan('combined')(req, res, next);
    } else {
        morgan('dev')(req, res, next);
    }
});
```
* 로그인 한 사람들한테만 static을 사용하고 싶을 때
```js
app.use('/', (req, res, next) => {
    if(req.session.id){
        express.static(__dirname, 'public')(req, res, next)
    } else {
        next();
    }
});
```
## 2-14. 멀티파트 데이터 형식
* form 태그의 enctype이 multipart/form-data인 경우
    * body-parser로는 요청 본문을 해석할 수 없음
    * multer 패키지 필요
```js
//콘솔
npm i multer
<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="image"/>
    <input type="text" name="title"/>
    <button type="submit">업로드</button>
</form>
```
## 2-15. multer 설정하기
* multer 함수를 호출
    * storage는 저장할 공간에 대한 정보이다.
    * diskStorage는 하드디스크에 업로드 파일을 저장한다는 것
    * destination은 저장할 경로이다.
    * filename은 저장할 파일명 (파일명+날짜+확장자 형식)
    * limits는 파일 개수나 파일 사이즈를 제한할 수 있다.
    * 실제 서버 운영 시에는 서버 디스크 대신에 S3같은 스토리지 서비스에 저장하는 게 좋음
        * Storage 설정만 바꿔주면 된다.
```js
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'upload/');
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});
```


