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
    * 깃헙같은곳에 절대 올리지 말자!
```js
const dotenv = require('dotenv');
dotenv.config();        // 최대한 위로
```
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
* 멀티파트 데이터 형식이란 form 태그의 enctype이 multipart/form-data인 경우이다.
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
    * done은 첫번째 인수는 보통 null, 두번째 인수에 값을 넣어준다.
        * 첫번째에 에러가 있다면 에러를 넣는다. 에러를 넣어주면 에러 처리 미들웨어로 넘겨준다.
        * req나 file의 데이터를 가공해서 done으로 넘기는 형식이다.
    * filename은 저장할 파일명 (파일명+날짜+확장자 형식)
    * limits는 파일 개수나 파일 사이즈를 제한할 수 있다.
    * 실제 서버 운영 시에는 서버 디스크 대신에 S3같은 스토리지 서비스에 저장하는 게 좋음
        * Storage 설정만 바꿔주면 된다.
```js
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'upload/');  //upload 폴더가 없으면 에러

        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    // 5 메가바이트아래 파일만
    limits: {fileSize: 5 * 1024 * 1024},
});
```
* upload 폴더가 없으면 에러가 나기 때문에 fs모듈을 사용해서 서버를 시작할 때 생성한다.
```js
const fs = require('fs');
try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('upload 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
```
## 2-16. multer 미들웨어들
* single과 none, array, fields 미들웨어 존재
    * single은 하나의 파일을 업로드 할 때 사용하고, none은 파일은 업로드하지 않을 때 사용한다.
    * req.file 안에 업로드 정보가 저장된다.
* array와 fields는 여러 개의 파일을 업로드 할 때 사용한다.
    * array는 하나의 요청 body 이름 아래 여러 파일이 있는 경우이다.
    * fields는 여러 개의 요청 body 이름 아래 파일이 하나씩 있는 경우이다.
    * files 안에 정보들이 배열로 저장되어 있다.
    * 두 경우 모두 업로드된 이미지 정보가 req.files 아래에 존재한다.

```js
// 하나만
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file, req.body);
    res.send('ok');
});
{
    fieldname: 'img',
    originalname: 'nodejs.png',
    ...
}

// 멀티
// <input type="file" name="many" multiple>인 경우
app.post('/upload', upload.array('many'), (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
});
// <input type="file" name="image1">
// <input type="file" name="image2">
// <input type="file" name="image3"> 인 경우
app.post('/upload',
    upload.fields([{name: 'image1'}, {name: 'image1'}]),
    (req, res) => {
        console.log(req.files, req.body);
        res.send('ok');
    }
);
// form에 enctype="multipart/form-data"지만 파일이 없는 경우
app.post('/upload', upload.none(), (req, res) => {
    console.log(req.body);
    res.send('ok');
});
```
```
        single ->   이미지 하나는 req.file로 나머지 정보는 req.body로
        array  ->       
multer              array, fields는 이미지들은 req.files로 나머지 정보는 req.body로
        fields ->
        none ->     모든 정보를 req.body로  
```
# 3. Router 객체로 라우터 분리하기
## 3-1. express.Router
* app.js 에서 app.get 같은 메서드가 라우터 부분이다.
* app.js가 길어지는 것으르 막을 수 있다.
* routes 폴더를 만들고 index.js와 user.js를 작성
* userRouter의 get은 /user와 /가 합쳐져서 GET /user/가 된다.
    * 만들어진 app.js 와 index.js를 아래 코드처럼 사용
```js
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    res
        .status(404)
        .send('Not Found');
});
```
## 3-2. 라우트 매개변수
* :id를 넣으면 req.params.id로 받을수 있다.
    * 동적으로 변하는 부분을 라우트 매개변수로 만든다.
```js
router.get('/user/:id', (req, res) => {
    console.log(req.params, req.query);
});
```
    * /user/123?limit=5&skip=10 주소 요청인 경우
```js
// 앞은 req.params, 뒤는 req.query (쿼리스트링)
{ id: 123 } {limit: '5', skip: '10'}
```
    * 일반 라우터보다 뒤에 위치해야 한다.
```js
router.get('/user/:id', (req, res) => {
    console.log('얘만 실행된다.');
});
router.get('/user/like', (req, res) => {
    console.log('전혀 실행되지 않는다.');
});
```
## 3-3. 404 미들웨어
* 요청과 일치하는 라우터가 없는 경우를 대비해 404 라우터를 만들기
    * 모든 라우터들 뒤에 둬야한다.
    * 모든 라우터에 걸리는게 없어야 404가 실행
    * 이게 없으면 단순히 Cannot GET 주소 라는 문자열이 표시된다.
```js
app.use((req, res, next) => {
    res
        .status(404)
        .send('Not Found');
});
```
## 3-4. 라우터 그룹화하기
* 주소는 같지만 메서드가 다른 코드가 있을 때는 router.route로 묶는다

```js
router.get('/abc', (req, res) => {
    res.send('GET /abc');
});
router.post('/abc', (req, res) => {
    res.send('GET /abc');
});
// 위의 두 코드를
router.route('/abc')
    .get('/abc', (req, res) => {
    res.send('GET /abc');
})
    .post('/abc', (req, res) => {
    res.send('GET /abc');
});
```
# 4. req, res 객체 살펴보기
## 4-1. req
* req.app: req 객체를 통해 app 객체에 접근할 수 있습니다. req.app.get('port')와 같은 식으로 사용할 수 있습니다.
* req.body: body-parser 미들웨어가 만드는 요청의 본문을 해석한 객체입니다.
* req.cookies: cookie-parser 미들웨어가 만드는 요청의 쿠키를 해석한 객체입니다.
* req.ip: 요청의 ip 주소가 담겨 있습니다.
* req.params: 라우트 매개변수에 대한 정보가 담긴 객체입니다.
* req.query: 쿼리스트링에 대한 정보가 담긴 객체입니다.
* req.signedCookies: 서명된 쿠키들은 req.cookies 대신 여기에 담겨 있습니다.
* req.get(헤더 이름): 헤더의 값을 가져오고 싶을 때 사용하는 메서드입니다
## 4-2. res
* res.app: req.app처럼 res 객체를 통해 app 객체에 접근할 수 있습니다.
* res.cookie(키, 값, 옵션): 쿠키를 설정하는 메서드입니다.
* res.clearCookie(키, 값, 옵션): 쿠키를 제거하는 메서드입니다.
* res.end(): 데이터 없이 응답을 보냅니다.
* res.json(JSON): JSON 형식의 응답을 보냅니다.
* res.redirect(주소): 리다이렉트할 주소와 함께 응답을 보냅니다.
* res.render(뷰, 데이터): 다음 절에서 다룰 템플릿 엔진을 렌더링해서 응답할 때 사용하는 메서드입니다.
* res.send(데이터): 데이터와 함께 응답을 보냅니다. 데이터는 문자열일 수도 있고H TML일 수도 있으며, 버퍼일 수도 있고 객체나 배열일 수도 있습니다.
* res.sendFile(경로): 경로에 위치한 파일을 응답합니다.
* res.setHeader(헤더, 값): 응답의 헤더를 설정합니다.
* res.status(코드): 응답 시의 HTTP 상태 코드를 지정합니다.

## 4-3. 기타
* 메서드 체이닝을 지원한다.
```js
res
    .status(201)
    .cookie('test', 'test')
    .redirect('/admin');
```
* 응답은 한번만 보내야 한다.

# 5. 템플릿 엔진 사용하기
* 예제는 Node.js 교과서 6장 확인
## 5-1. 템플릿 엔진
* HTML의 정적인 단점을 개선
    * 반복문, 조건문, 변수 등을 사용할 수 있다.
    * 동적인 페이지 작성 가능
    * PHP, JSP와 유사하다.
## 5-2. PUG(구 Jade)
* 문법이 Ruby와 비슷해 코드 양이 많이 줄어든다.
    * HTML과 많이 달라 호불호가 갈린다.
    * 익스프레스에 app.set으로 퍼그를 연결한다.
```js
...
app.set('port', process.env.PORT || 3003);
// views폴더안의 파일들을 .pug로 만든다.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
...
```
## 5-3. Pug - HTML 표현
```js
// 퍼그
doctype html
html
    head
        title = tile
        link(rel='stylesheet', href='/stylesheets/style.css')
// HTML
<!DOCTYPE html>
<html>
    <head>
    <title>익스프레스</title>
    <link rel='stylesheet' href="/style.css"/>
    </head>
</html>
```
```js
// 퍼그
#login-button
.post-image
span#highlight
p.hidden.full
// HTML
<div id="login-button"></div>
<div class="post-image"></div>
<span id="highlight"></span>
<p class="hidden full"></p>
```
```js
// 퍼그
p Welcome to Express
button(type='submit') 전송
// HTML
<p>Welcome to Express</p>
<button type="submit">전송</button>
```
```js
// 퍼그
p
    | 안녕하세요.
    | 여러 줄을 입력합니다.
    br
    | 태그도 중간에 넣을 수 있습니다.
// HTML
<p>
    안녕하세요. 여러 줄을 입력합니다.
    <br/>
    태그도 중간에 넣을 수 있습니다.
</p>
```
```js
// 퍼그
style.
    h1 {
        font-size: 30px;
    }
script.
    const message = 'Pug';
    alert(message);
// HTML
<style>
    h1 {
        font-size: 30px;
    }
</style>
<script>
    const message = 'Pug';
    alert(message);
</script>
```
## 5-4. Pug - 변수
* res.render에서 두 번째 인수 객체에 Pug 변수를 넣음.
```js
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});
```
* res.locals 객체에 넣는 것도 가능하다.(미들웨어간 공유됨)
```js
router.get('/', (req, res, next) => {
    res.locals.title = 'Express';
    res.render('index');
});
```
* =이나 #{}으로 변수 렌더링 가능(= 뒤에는 자바스크립트 문법 사용 가능)
```js
// 퍼그
h1 = title
p Welcome to #{title}
button(class=title, type='submit')
// HTML
<h1>Express</h1>
<p>Welcome to Express</p>
<button class="Express" type="submit">전송</button>
<input placeholder="Express 연습"/>
```
## 5-5. Pug - 파일 내 변수
* 퍼그 파일 안에서 변수 선언 가능
    * '-' 뒤에 자바스크립트 사용
    * 변수 값을 이스케이프 하지 않을 수도 있음(자동 이스케이프)
```js
// 퍼그
- const node = 'Node.js'
- const js = 'Javascript'
p # {node} 와 # {js}
// HTML
<p>Node.js와 Javascript</p>
```
```js
// 퍼그
p= '<strong>이스케이프</strong>'
p!= '<strong>이스케이프하지 않음</strong>'
// HTML
<p>&lt;strong&gt;이스케이프&lt;/strong&gt;</p>
<p><strong>이스케이프하지 않음</strong></p>
```
## 5-6. Pug - 반복문
* for in이나 each in으로 반복문 돌릴 수 있음
```js
// 퍼그
ul
    each fruit in ['사과', '배', '오렌지', '바나나', '복숭아']
    li= fruit
// HTML
<ul>
    <li>사과</li>
    <li>배</li>
    <li>오렌지</li>
    <li>바나나</li>
    <li>복숭아</li>
</ul>
```
* 값과 인덱스 가져올 수 있음
```js
// 퍼그
ul
    each fruit, index in ['사과', '배', '오렌지', '바나나', '복숭아']
    li= (index + 1) + '번째' + fruit
// HTML
<ul>
    <li>1번째 사과</li>
    <li>2번째 배</li>
    <li>3번째 오렌지</li>
    <li>4번째 바나나</li>
    <li>5번째 복숭아</li>
</ul>
```
## 5-7. Pug - 조건문
* if else if else문, case when문 사용 가능

## 5-8. Pug - include
* 퍼그 파일에 다른 퍼그 파일을 넣을 수 있음.
    * 헤더, 푸터, 내비게이션 등의 공통 부분을 따로 관리할 수 있어 편리
    * include로 파일 경로 지정

## 5-9. Pug - extends와 block
* 레이아웃을 정할 수 있음
    * 공통되는 레이아웃을 따로 관리할 수 있어 좋음, include와도 같이 사용

## 5-10. 넌적스
* Pug의 문법에 적응되지 않는다면 넌적스를 사용하면 좋음.
    * Pug를 지우고 Nunjucks 설치
    * 확장자는 html 또는 njk(view engine을 njk로)
```js
// 콘솔
npm i nunjucks
// view engine을 퍼그 대신 넌적스로 교체한다.
...
const nunjucks = require('nunjucks');
...
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true,
});
...
```
## 5-11. 넌적스 - 변수
* {{변수}}
```js
<h1>{{title}}</h1>
<p>Welcome to {{title}}</p>
<button class="{{title}}" type="submit">전송</button>
<input placeholder="{{title}} 연습"/>
```
* 내부 변수 선언 가능 {%set 자바스크립트 구문}
```html
<!-- 넌적스 -->
{% set node = 'Node.js' %}
{% set js = 'Javascript'%}
<p>{{node}}와 {{js}}</p>
<!-- HTML -->
<p>Node.js와 Javascript</p>
<!-- 넌적스 -->
<p>{{'<strong>이스케이프</strong>'}}</p>
<p>{{'<strong>이스케이프 하지 않음</strong>' | safe}}</p>
<!-- HTML -->
<p>&lt;strong&gt;이스케이프&lt;/strong&gt;'</p>
<p><strong>이스케이프 하지 않음</strong></p>
```
## 5-12. 넌적스 - 반복문
* {% %} 안에 for in 작성(인덱스는 loop 키워드)
```html
<!-- 넌적스 -->
<ul>
    {% set fruits = ['사과', '배', '오렌지', '바나나', '복숭아']%}
    {% for item in fruits %}
    <li>{{item}}</li>
    {% endfor %}
</ul>
<!-- HTML -->
<ul>
    <li>사과</li>
    <li>배</li>
    <li>오렌지</li>
    <li>바나나</li>
    <li>복숭아</li>
</ul>
<!-- 넌적스 -->
<ul>
    {% set fruits = ['사과', '배', '오렌지', '바나나', '복숭아']%}
    {% for item in fruits %}
    <li>{{loop.index}}번째 {{item}}</li>
    {% endfor %}
</ul>
<!-- HTML -->
<ul>
    <li>1번째 사과</li>
    <li>2번째 배</li>
    <li>3번째 오렌지</li>
    <li>4번째 바나나</li>
    <li>5번째 복숭아</li>
</ul>
```

## 5-13. 넌적스 - 조건문
* {% if %} 안에 조건문 작성
```html
{% if isLoggedIn %}
<div>로그인 되었습니다.</div>
{% else %}
<div>로그인이 필요합니다.</div>
{% endif %}

{% if fruit === 'apple'%}
<p>사과입니다.</p>
{% elif fruit === 'banana'%}
<p>바나나입니다.</p>
{% elif fruit === 'orange'%}
<p>오렌지입니다.</p>
{% else %}
<p>사과도 바나나도 오렌지도 아닙니다.</p>
{% endif %}
```

## 5-14. 넌적스 - include
* 파일이 다른 파일을 불러올 수 있음
    * include에 파일 경로를 넣어줄 수 있다.
```js
// 넌적스
// header.html
<header>
    <a href="/">Home</a>
    <a href="/about">About</a>
</header>
// footer.html
<footer>
    <div>푸터입니다.</div>
</footer>
// main.html
{% include "header.html"%}
<main>
    <h1>메인 파일</h1>
    <p>다른 파일을 include할 수 있습니다.</p>
</main>
{% include "footer.html"%}

// HTML
<header>
    <a href="/">Home</a>
    <a href="/about">About</a>
</header>
<main>
    <h1>메인 파일</h1>
    <p>다른 파일을 include할 수 있습니다.</p>
</main>
<footer>
    <div>푸터입니다.</div>
</footer>
```
## 5-15. 넌적스 - 레이아웃
* 레이아웃을 정할 수 있음
    * 공통되는 레이아웃을 따로 관리할 수 있어 좋음, include와도 같이 사용
```js
// 넌적스
// layout.html
<!DOCTYPE html>
<html>
    <head>
        <title>{{title}}</title>
        <link rel="stylesheet" href="/style.css"/>
        {% block content %}
        {% endblock %}
    </head>
    <body>
        <header>헤더입니다.</header>
        {% block content %}
        {% endblock %}
        <footer>푸터입니다.</footer>
        {% block content %}
        {% endblock %}
    </body>
</html>
// body.html
{% extends 'layout.html'%}

{% block content %}
<main>
    <p>내용입니다.</p>
</main>
{% endblock %}

{% block content %}
    <script src="/main.js"></script>
{% endblock %}
// HTML
<!DOCTYPE html>
<html>
    <head>
        <title>{{title}}</title>
        <link rel="stylesheet" href="/style.css"/>
        
    </head>
    <body>
        <header>헤더입니다.</header>
        <main>
            <p>내용입니다.</p>
        </main>
        <footer>푸터입니다.</footer>
        <script src="/main.js"></script>
    </body>
</html>
```

## 5-16. 에러 처리 미들웨어
* 에러 발생 시 템플릿 엔진과 상관없이 템플릿 엔진 변수를 설정하고 error 템플릿을 렌더링함.
    * res.locals. 변수명으로도 템플릿 엔진 변수 생성 가능
    * process.env.NODE_ENV는 개발환경인지 배포환경인지 구분해주는 속성이다.
```js
...
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production'
        ? err
        : {};
    res.status(err.status || 500);
    res.render('error');
});
...
```