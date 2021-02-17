웹 API 서버 만들기
==================
# 1. API 서버 이해하기
## 1-1. NodeBird SNS 서비스
* 9 장 NodeBird 서비스의 API 서버를 만든다.
* API : Application Programming Interface
    * 다른 애플리케이션에서 현재 프로그램의 기능을 사용할 수 있게 함.
    * 웹 API: 다른 웹 서비스의 기능을 사용하거나 자원을 가져올 수 있게 함.
    * 다른 사람에게 정보를 제공하고 싶은 부분만 API를 열고, 제공하고 싶지 않은 API를 만들지 않으면 됨.
    * API에 제한을 걸어 일정 횟수 내에서만 가져가게 할 수도 있음.
    * NodeBird에서는 인증된 사용자에게만 정보 제공
    * 크롤링을 하면 관리가 안되지만 API를 사용하면 관리가 가능하다.
* 예를 들어, 인스타 그램을 크롤링을 할때 잘못할 경우 디도스가 될 수 있다. 그럴 경우 API를 제공해서 해결한다.
# 2. 프로젝트 구조 갖추기
## 2-1. NodeBird API 폴더 세팅
* nodebird-api 폴더를 만들고 package.json 생성
    * 생성 후 npm i로 패키지 설치
    * NodeBird에서 config, models, passport 모두 복사해서 nodebird-api에 붙여넣기
    * routes 폴더에서는 auth.js와 middlewares 재사용
    * .env 파일 복사
    * views 폴더를 만들고 error.html 파일 생성
## 2-2. app.js 생성하기
* app.js 참조
* 8002번 포트 사용
    * 8001번을 사용하는 Nodebird 서비스와 8003을 사용할 nodecat 서비스와 함께 사용할 수 있다.
    * 콘솔을 여러 개 실행해서 각각의 서비스를 실행한다.
* views/login.html 화면 생성
    * NodeBird 서비스의 계정으로 로그인하면 된다.(카카오톡 로그인은 미구현)
## 2-3. 도메인 모델 생성하기
* models/domain.js 참조
    * API를 사용할 도메인(또는 호스트)을 저장하는 모델
    * ENUM type으로 free나 premium만 쓸 수 있게 제한
    * clientSecret은 uuid 타입으로
```js
// domain.js
...
clientSecret: {
    // 올바른 uuid타입인지를 검사하고 싶다면
    // type: Sequelize.UUIDV4, 를 사용
    type:Sequelize.STRING(36), allowNull: false,;
},
...
```
## 2-4. 도메인 등록 라우터
* routes/index에서 도메인 등록 라우터 생성
    * uuid 패키지로 사용자가 등록한 도메인에 고유한 비밀번호 부여
    * uuid는 충돌(고유하지 않은 상황) 위험이 있지만 매우 희박
    * 비밀번호가 일치하는 요청만 API 응답
## 2-5. 도메인 등록하고 비밀번호 발급받기
* 라우터 작성 후 localhost:8002 접속
    * 도메인이 다른 프런트엔드에서 요청을 보내면 CORS 에러(10.7) 발생
    * 로그인 후 localhost:8003(nodecat 서버) 등록
# 3. JWT 토큰으로 인증하기
## 3-1. 인증을 위한 JWT
* NodeBird가 아닌 다른 클라이언트가 데이터를 가져가게 하려면 인증 과정이 필요함
* JWT(JSON Web Token)을 사용함  
    * 헤더.페이로드.시그니처로 구성됨
    * 헤더: 토큰 종류와 해시 알고리즘 정보가 들어있음
    * 페이로드: 토큰의 내용물이 인코딩된 부분
    * 시그니처: 일련의 문자열로, 시그니처를 통해 토큰이 변조되었는지 여부 확인
    * 시그니처는 JWT 비밀키로 만들어지고, 비밀키가 노출되면 토큰 위조 가능

```js
// 인코드
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
## 3-2. JWT 사용 시 주의점
* JWT에 민감한 내용을 넣으면 안 됨
    * 페이로드 내용 볼 수 있음
    * 그럼에도 사용하는 이유는 토큰 변조가 불가능하고, 내용물이 들어있기 때문
    * 내용물이 들어있으므로 데이터베이스 조회를 하지 않을 수 있음(데이터베이스 조회는 비용이 큰 작업)
    * 노출되어도 좋은 정보만 넣어야 함
    * 용량이 커서 요청 시 데이터 양이 증가한다는 단점이 있음
* https://jwt.io/ 에서 사용가능

## 3-3 노드에서 JWT 사용하기
* JWT 모듈 설치
    * npm i jsonwebtoken
    * JWT 비밀키 .env에 저장
    * JWT 토큰을 검사하는 verifyToken 미들웨어 작성
    * jwt.verify 메서드로 검사 가능(두 번째 인수가 JWT 비밀키)
    * JWT 토큰은 req.headers.authorization에 들어 있음
    * 만료된 JWT 토큰인 경우 419 에러 발생
    * 유효하지 않은 토큰인 경우 401에러 발생
    * req.decoded에 페이로드를 넣어 다음 미들웨어에서 쓸 수 있게 함

## 3-4. JWT 토큰 발급 라우터 만들기
* routes/v1.js 작성
    * 버전 1이라는 뜻의 v1.js
    * 한 번 버전이 정해진 후에는 라우터를 함부로 수정하면 안 됨
    * 다른 사람이 기존 API를 쓰고 있기 때문(그 사람에게 영향이 감)
    * 수정 사항이 생기면 버전을 올려야 함
    * POST /token에서 JWT 토큰 발급
    * 먼저 도메인 검사 후 등록된 도메인이면 jwt.sign 메서드로 JWT 토큰 발급
    * 첫 번째 인수로 페이로드를 넣고, 두 번째 인수는 JWT 비밀키, 세 번째 인수로 토큰 옵션(expiresIn은 만료 시간, issuer은 발급자)
    * expiresIn은 1m(1분), 60 * 1000같은 밀리초 단위도 가능
    * GET /test 라우터에서 토큰 인증 테스트 가능
    * 라우터의 응답은 일정한 형식으로 해야 사용자들이 헷갈리지 않음
    * app.js에 라우터 연결
```js
...
const token = jwt.sign({
        id: domain.User.id,
        nick: domain.User.nick,
    }, process.env.JWT_SECRET, {
        expiresIn: '1m',    // 유효기간, 1분
        issuer: 'nodebird', //  발급자
});
...
```

## 3-5. JWT 토큰으로 로그인하기
* 세션 쿠키 발급 대신 JWT 토큰을 쿠키로 발급하면 됨
    * Authenticate 메서드의 두 번째 인수로 옵션을 주면 세션 사용하지 않음
* 클라이언트에서 JWT를 사용하고 싶다면
    * process.env.JWT_SECRET은 클라이언트에서 노출되면 안 됨
    * RSA같은 양방향 비대칭 암호화 알고리즘을 사용해야 함
    * JWT는 PEM 키를 사용해서 양방향 암호화를 하는 것을 지원함

# 4. 호출 서버 만들기
## 4-1. API 호출용 서버 만들기
* nodecat 폴더 만들고 package.json 파일을 만든다.
## 4-2. 간단한 폴더 구조 갖추기
* app.js 파일 생성
    * nodecat/app.js 참조
    * 발급받은 클라이언트 비밀키를 .env에 입력
## 4-3. 토큰 테스트용 라우터 만들기
* routes/index.js 생성
    * GET /test에 접근 시 세션 검사
    * 세션에 토큰이 저장되어 있지 않으면 POST http://localhost:8002/v1/token 라우터로부터 토큰 발급
    * 이 때 HTTP 요청 본문에 클라이언트 비밀키 동봉
    * 발급에 성공했다면 발급받은 토큰으로 다시 GET https://localhost:8002/v1/test 라우터 접근해서 토큰 테스트
## 4-4. 실제 요청 보내기
* 서버 시작 후 http://localhost:4000/test로 접속
    * 1분을 기다린 후 다시 접속하면 토큰이 만료되었다는 메시지 뜸

# 5. SNS API 서버 만들기

