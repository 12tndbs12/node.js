익스프레스로 SNS 서비스 만들기
==============================
# 1. 프로젝트 구조 갖추기
## 1-1. NodeBird SNS 서비스
* 기능: 로그인, 이미지 업로드, 게시글 작성, 해시태그 검색, 팔로잉
    * express-generator 대신 직접 구조를 갖춤
    * 프런트엔드 코드보다 노드 라우터 중심으로 보자
    * 관계형 데이터베이스 MySQL 사용
## 1-2. 프로젝트 시작하기
* nodebird 폴더를 만들고 package.json 파일 생성
    * package.json은 노드 프로젝트의 기본이다.
* 시퀄라이즈 폴더 구조를 생성한다.
```
// 콘솔
$ npm i sequelize mysql2 sequelize-cli
$ npx sequelize init
```
## 1-3. 폴더 구조 설정
* views(템플릿 엔진), routes(라우터), public(정적 파일), passport(패스포트) 폴더 생성
* app.js와 .env 파일도 생성

## 1-4. 패키지 설치와 nodemon
* npm 패키지 설치 후 nodemon도 설치
    * nodemon은 서버 코드가 변경되었을 때 자동으로 서버를 재시작해줌
    * nodemon은 콘솔 명령어이기 때문에 글로벌로 설치
```
$ npm i express express-session cookie-parser morgan nunjucks dotenv multer
$ npm i -D nodemon
```

## 1-5. app.js
* 노드 서버의 핵심인 app.js 파일 작성
    * 소스 코드는 https://github.com/zerocho/nodejs-book
    * .env도 같이 추가

# 2. 데이터베이스 세팅하기
## 2-1. 모델 생성
* 소스 코드는 nodebird 참조
    * models/user.js: 사용자 테이블과 연결됨
    * provider: 카카오 로그인인 경우 kakao, 로컬 로그인(이메일/비밀번호)인 경우 local
    * snsId: 카카오 로그인인 경우 주어지는 id
    * models/post.js: 게시글 내용과 이미지 경로를 저장(이미지는 파일로 저장)
    * models/hashtag.js: 해시태그 이름을 저장(나중에 태그로 검색하기 위해서)
## 2-2. models/index.js
* 시퀄라이즈가 자동으로 생성해주는 코드 대신 index.js 처럼 변경 
    * 모델들을 불러옴(require)
    * 모델 간 관계가 있는 경우 관계 설정
    * User(1):Post(다)
    * Post(다):Hashtag(다)
    * User(다):User(다)
## 2-3. associate 작성하기
* 모델간의 관계들 associate에 작성
    * 1대다: hasMany와 belongsTo
    * 다대다: belongsToMany
        * foreignKey: 외래키
        * as: 컬럼에 대한 별명
        * through: 중간 테이블명
## 2-4. 팔로잉-팔로워 다대다 관계
* User(다):User(다)
    * 다대다 관계이므로 중간 테이블(Follow) 생성됨
    * 모델 이름이 같으므로 구분 필요함(as가 구분자 역할, foreignKey는 반대 테이블 컬럼의 프라이머리 키 컬럼)
    * 시퀄라이즈는 as 이름을 바탕으로 자동으로 addFollower, getFollowers, addFollowing, getFollowings 메서드 생성
## 2-5. 시퀄라이즈 설정하기
* 시퀄라이즈 설정은 config/config.json에서
    * 개발환경용 설정은 development 아래에
* 설정 파일 작성 후 nodebird 데이터베이스 생성
```
//콘솔
$ npx sequelize db:create
```

## 2-6. 모델과 서버 연결하기
* sequelize.sync()가 테이블을 생성한다.
    * IF NOT EXIST(SQL문)으로 테이블이 없을 때만 생성해준다.
    * npm start로 서버 실행 시 콘솔에 SQL문이 표시된다.

# 3. Passport 모듈로 로그인
## 3-1. 패스포트 설치하기
*  로그인 과정을 쉽게 처리할 수 있게 도와주는 Passport 설치하기
    * 비밀번호 암호화를 위한 bcrypt도 같이 설치
    * 설치 후 app.js와도 연결
    * passport.initialize(): 요청 객체에 passport 설정을 심음
    * passport.session(): req.session 객체에 passport 정보를 저장
    * express-session 미들웨어에 의존하므로 이보다 더 뒤에 위치해야 한다.
```
//콘솔
$ npm i passport passport-local passport-kakao bcrypt
```
```js
// app.js
...
const dotenv = require('dotenv');
const passport = require('passport');   //패스포트

dotenv.config();
const pageRouter = require('./routes/page');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();   // 패스포트 설정
...
...
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
...
```

## 3-2. 패스포트 모듈 작성
* passport/index.js 작성
    * passport.serializeUser: req.session 객체에 어떤 데이터를 저장할 지 선택, 사용자 정보를 다 들고 있으면 메모리를 많이 차지하기 때문에 사용자의 아이디만 저장
    * passport.deserializeUser: req.session에 저장된 사용자 아이디를 바탕으로 DB 조회로 사용자 정보를 얻어낸 후 req.user에 저장
```js
module.exports = () => {
    // serializeUser는 로그인 시에만 실행
    passport.serializeUser((user, done) => {
        done(null, user.id);    // 세션에 user의 id만 저장
        // done(null, user.email);     세션에 user의 email만 저장
    });
    
    // app.use(passport.session());이 실행될때 실행된다.
    // deserializeUser는 매 요청 시 실행
    passport.deserializeUser((id, done) => {
        User.findOne({ where: {id} })
            .then(user => done(null, user))     // req.user, req.isAuthenticated()로 불러올 수 있다.
            .catch(err => done(err));
    });
    local();
    kakao();
};
```
## 3-3. 패스포트 처리 과정
* 로그인 과정
    * 로그인 요청이 들어옴
    * auth.js에 passport.authenticate 메서드 호출
    * localStrategy에서 로그인 전략 수행(전략은 뒤에 알아봄)
    * auth.js에 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
    * req.login 메서드가 index.js에 passport.serializeUser 호출
    * req.session에 사용자 아이디만 저장
    * 로그인 완료
* 로그인 이후 과정
    * 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드를 호출한다.
    * req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
    * 조회된 사용자 정보를 req.user에 저장
    * 라우터에서 req.user 객체 사용 가능

## 3-4. 로컬 로그인 구현하기
* passport-local 패키지가 필요하다.
    * 로컬 로그인 전략 수립
    * 로그인에만 해당하는 전략이므로 회원가입은 따로 만들어야 함
    * 사용자가 로그인했는지, 하지 않았는지 여부를 체크하는 미들웨어도 만듦

## 3-5. 회원가입 라우터
* routes/auth.js 작성
    * bcrypt.hash로 비밀번호 암호화
    * hash의 두 번째 인수는 암호화 라운드
    * 라운드가 높을수록 안전하지만 오래 걸림
    * 적당한 라운드를 찾는 게 좋음
    * ?error 쿼리스트링으로 1회성 메시지

## 3-6. 로그인 라우터
* routes/auth.js 작성
    * passport.authenticate(‘local’): 로컬 전략
    * 전략을 수행하고 나면 authenticate의 콜백 함수 호출됨
    * authError: 인증 과정 중 에러,
    * user: 인증 성공 시 유저 정보
    * info: 인증 오류에 대한 메시지
    * 인증이 성공했다면 req.login으로 세션에 유저 정보 저장
## 3-7. 로컬 전략 작성
* passport/localStrategy.js 작성
    * usernameField와 passwordField가 input 태그의 name(body-parser의 req.body)
    * 사용자가 DB에 저장되어있는지 확인한 후 있다면 비밀번호 비교(bcrypt.compare)
    * 비밀번호까지 일치한다면 로그인

## 3-8. 카카오 로그인 구현
* passport/kakaoStrategy.js 작성
    * clientID에 카카오 앱 아이디 추가
    * callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
    * accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰(예제에선 사용하지 않음)
    * profile: 카카오가 보내준 유저 정보
    * profile의 정보를 바탕으로 회원가입

## 3-9. 카카오 로그인용 라우터 만들기
* 회원가입과 로그인이 전략에서 동시에 수행된다.
    * passport.authenticate(‘kakao’)만 하면 됨
    * /kakao/callback 라우터에서는 인증 성공 시(res.redirect)와 실패 시(failureRedirect) 리다이렉트할 경로 지정

## 3-10. 카카오 로그인 앱 만들기
*  https://developers.kakao.com에 접속하여 회원가입
* 애플리케이션 추가하기
* 앱 생성후 REST API 키를 받아 .env에 저장
* 플랫폼 -> Web에서 http://localhost:8001 등록
* Redirect URI는 http://loaclhost:8001/auth/kakao/callback 으로 등록
* 카카오톡 로그인 버튼을 누르면 카카오 로그인 창으로 전환된다.
* 계정 동의 후 다시 NodeBird 서비스로 리다이렉트된다.








