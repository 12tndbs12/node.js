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
        * 크롤링 : 표면적으로 보이는 웹 사이트의 정보를 일정 주기로 수집해 자제적으로 가공하는 기술이다.
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
        * uuid : 고유한 랜덤 문자열을 만들어 내는데 사용한다.
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
```js
router.get('/test', async (req, res, next) => {     //토큰 테스트 라우터
       try {
        if (!req.session.jwt) {     // 세션에 토큰이 없으면 토큰 발급 시도
            const tokenResult = await axios.post(`http://localhost:8002/v1/token`, {
                clientSecret: process.env.CLIENT_SECRET,
            });
            if (tokenResult.data && tokenResult.data.code === 200) {  //토큰 발급 성공
                req.session.jwt = tokenResult.data.token;   //세션에 토큰 저장
            }else{  //토큰 발급 실패
                return res.json(tokenResult.data);  // 발급 실패 사유 응답
            }
        }
        // 발급 받은 토큰 테스트
        const result = await axios.get('http://localhost:8002/v1/test', {
            headers: { authorization: req.session.jwt},
        });
        return res.json(result.data);
    } catch (error) {
        console.error(error);
        if (error.response.status === 419) { // 토큰 만료 시
            return res.json(error.response.data);
        }
        return next(error);
    }
});

```
## 4-4. 실제 요청 보내기
* 서버 시작 후 http://localhost:4000/test로 접속
    * 1분을 기다린 후 다시 접속하면 토큰이 만료되었다는 메시지 뜸

# 5. SNS API 서버 만들기
## 5-1. NodeBird 데이터 제공하기
* nodebird-api의 라우터 작성
    * GET /posts/my 와 GET /posts/hashtag/:title
## 5-2. NodeBird 데이터 가져오기
* nodecat의 라우터 작성
    * 토큰을 발급받고 요청을 보내는 부분을 request 함수로 만들어 둠
    * 요청은 axios로 보내고 세션 토큰 검사, 재발급까지 같이 수행
* nodecat/routes/index.js 참조
## 5-3. 실제 요청 보내기
* localhost:4000/mypost에 접속하면 게시글 받아옴(NodeBird 서비스에 게시글이 있어야 함)
* localhost:4000/search/노드 라우터에 접속하면 노드 해시태그 검색

# 6. 사용량 제한 구현하기
## 6-1. 사용량 제한 구현하기
* DOS 공격 등을 대비해야 함
    * DDOS는 DOS가 발전한것
        * DOS는 한사람이 여러번 새로고침하는것
        * DDOS는 여러사람이 여러번 새로고침하는것
    * 일정 시간동안 횟수 제한을 두어 무차별적인 요청을 막을 필요가 있음
    * nodebird-api에 npm i express-rate-limit
    * routes/middlewares.js에 apiLimiter 미들웨어 추가
    * windowMS(기준 시간(몇분간)), max(허용 횟수(최대 한번)), delayMS(호출 간격()), handler(제한 초과 시 콜백)
    * deprecated 미들웨어는 사용하면 안 되는 라우터에 붙여서 사용 시 경고
        * 버그가 있거나 새로운 버전이 나온걸 알려주는 라우터
```js
exports.apiLimiter = new RateLimit({
    windowMs: 60 * 1000,    // 1분간
    max: 10,                // 최대 10번
    delayMs: 1000,          // 1초의 간격을 두어야함
    handler(req, res) {     // 어겼을시 발생되는 함수
        res.status(this.statusCode).json({  //429
            code: this.statusCode,
            message: '1분에 한 번만 요청할 수 있습니다.'
        })
    }
});
```
## 6-2. 응답 코드 정리
* 응답 코드를 정리해서 어떤 에러가 발생했는지 알려주기
    * 일관성이 있으면 된다.
```
| 응답 코드 |       메세지      |
    200     | JSON 데이터입니다.
    401     | 유효하지 않은 토큰입니다.
    410     | 새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.
    419     | 토큰이 만료되었습니다.
    429     | 1분에 한번만 요청할 수 있습니다.
    500~    | 기타 서버 에러
```
## 6-3. 새 라우터 버전 내놓기
* 사용량 제한 기능이 추가되어 기존 API와 호환되지 않음
    * 이런 경우 새로운 버전의 라우터를 내놓으면 됨
    * v2 라우터 작성(apiLimiter 추가됨)
    * v1 라우터는 deprecated 처리(router.use로 한 번에 모든 라우터에 적용)
## 6-4. 새 라우터 실행해보기
* nodecat의 버전 v2로 바꾸기
    * nodecat/routes/index.js에 URL변경
* v1 API를 사용하거나 사용량을 초과하면 에러 발생

# 7. CORS 이해하기
## 7-1. nodecat 프런트 작성하기
* 프런트에서 서버의 API를 호출하면 어떻게 될까?
    * routes/index.js와 views/main.html 작성
```js
// routes/index.js
// 클라이언트가 노출되면 안되기 때문에
// 프론트로 보내는 키는 따로 만들어 주는게 좋다.
// 본 예제에서는 간단하게 구현하기 위해 클라이언트 키를 사용
router.get('/', (req, res) => {
    res.render('main', {key: process.env.CLIENT_SECRET});
});
```
## 7-2. 프런트에서 요청 보내기
* localhost:4000에 접속하면 에러 발생
    * CORS에러
    * 콘솔에 'Access-Control-Allow-Origin' 에러
* 요청을 보내는 프런트(localhost:4000), 요청을 받는 서버(localhost:8002)가 다르면 에러 발생(서버에서 서버로 요청을 보낼때는 발생하지 않음)
    * CORS: Cross-Origin Resource Sharing 문제
    * POST 대신 OPTIONS 요청을 먼저 보내 서버가 도메인을 허용하는지 미리 체크

## 7-3. CORS 문제 해결 방법
* Access-Control-Allow-Origin 응답 헤더를 넣어주어야 CORS 문제 해결 가능
    * res.set 메서드로 직접 넣어주어도 되지만 패키지를 사용하는게 편리
    * npm i cors
    * v2 라우터에 적용
    * credentials: true를 해야 프런트와 백엔드 간에 쿠키가 공유됨
* 에러는 브라우저(localhost:4000)가 일으키지만 해결을 서버(localhost:8002)에서 해야함
```js
// v2.js
...
// ''은 모든 주소 허용
// 'localhost:4000' 노드 캣만 허용
res.setHeader('Access-Control-Allow-Origin', '');

// nodebird-api/app.js
// 복잡함 cors 사용
...
app.use(cors({
    // origin: 'localhost:4000',
    // origin 여러개 허용하고 싶다면
    // origin: ['localhost:4000', 'localhost:4001'],

    // origin: true, 이렇게 써야 credentials와 같이 쓸수 있다. 공식문서 참조
    credentials: true,  // 쿠키까지 서로 주고받고 하고싶으면 true
}));
...
```

## 7-4. CORS 적용 확인하기
* http://localhost:4000에 접속하면 정상적으로 토큰이 발급됨
* 응답 헤더를 보면 Access-Control-Allow-Origin 헤더가 들어 있음
* *은 모든 도메인을 허용함을 의미
* 실제로는 cors를 app.use에 넣어주는게 아닌 라우터마다 다르게 적용하는게 좋다.

## 7-5. 클라이언트 도메인 검사하기
* 클라이언트 환경에서는 비밀키가 노출됨
    * 도메인까지 같이 검사해야 요청 인증 가능
    * 호스트와 비밀키가 모두 일치할 때만 CORS를 허용
    * 클라이언트의 도메인(req.get(‘origin’))과 등록된 호스트가 일치하는 지 찾음
    * url.parse().host는 http같은 프로토콜을 떼어내기 위함
        * node14부터 추가된 옵셔널체이닝 ?.
        * 앞이 undefined면 undefined이고 앞이 객체면 객체안에서 호스트를 꺼내옴 
    * cors의 인자로 origin을 주면 * 대신 주어진 도메인만 허용할 수 있음
* 현재는 클라이언트와 서버에서 같은 비밀 키를 써서 문제가 될 수 있다.
    * 카카오처럼 환경별로 키를 구분해서 발급하는 것이 바람직하다
    * 카카오의 경우 REST API 키가 서버용 비밀 키이고, 자바스크립트 키가 클라이언트용 비밀 키이다.
```js
// v2.js
router.use(async (req, res, next) => {
    const domain = await Domain.findOne({
        
        where: { host: url.parse(req.get('origin'))?.host}
    });
    if (domain) {
        cors({
            origin: true,
            credentials: true,
        })(req, res, next);
    }else {
        next(); 
    }
});
```
## 7-6. 유용한 미들웨어 패턴 알아보기
* 위의 미들웨어를 아래처럼 수정 가능
    * 아래처럼 쓰면 미들웨어 위 아래로 임의의 코드를 추가할 수 있음
    * 활용 가능
```js
router.use(cor());

router.use((req, res, next) => {
    cors()(req, res, next);
})
```
## 7-7. 프록시 서버
* CORS 문제에 대한 또다른 해결책
    * 서버-서버 간의 요청/응답에는 CORS 문제가 발생하지 않는 것을 활용
    * 직접 구현해도 되지만 http-proxy-middleware같은 패키지로 손쉽게 연동 가능
* 본 예제에서는 구현하지 않음

# 핵심정리
* API는 다른 애플리케이션의 기능을 사용할 수 있게 해주는 창구이다.
    * NodeCat이 NodeBird의 API를 사용하고 있다.
* 모바일 서버를 구성할 때 서버를 REST API 방식으로 구현하면 된다.
* API 사용자가 API를 쉽게 사용할 수 있도록 사용 방법, 요청 형식, 응답 내용에 관한 문서를 준비하자.
* JWT 토큰의 내용은 공개되며 변조될 수 있다.
    * 시그니처를 확인하면 변조되었는지 체크할 수 있다.
* 토큰을 사용해서 API의 오남용을 막는다. 요청 헤더에 토큰이 있는지를 항상 확인하는 것이 좋다.
* app.use 외에도 router.use를 활용하여 라우터 간에 공통되는 로직을 처리할 수 있다.
* cors 나 passport.authenticate처럼 미들웨어 내에서 미들웨어를 실행할 수 있다.
    * 미들웨어를 선택적으로 적용하거나 커스터마이징할 때 이 기법을 사용한다.
* 브라우저와 서버의 도메인이 다르면 요청이 거절되는 CORS특성을 이해하자.
    * 서버와 서버 간의 요청에서는 CORS 문제가 발생하지 않는다.

# 스스로 해보기
* 팔로워나 팔로잉 목록을 가져오는 API 만들기(nodebird-api에 새로운 라우터 추가)
* 무료 도메인과 프리미엄 도메인 간에 사용량 제한을 다르게 적용하기(apiLimiter를 두 개 만들어서 도메인별로 다르게 적용, 9.3.1절의 POST /auth/login 라우터 참조)
* 클라이언트용 비밀 키와 서버용 비밀 키를 구분해서 발급하기(Domain 모델 수정)
* 클라이언트를 위해 API 문서 작성하기(swagger나 apidoc 사용)