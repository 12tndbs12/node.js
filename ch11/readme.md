노드 서비스 테스트하기
======================
# 1. 테스트 준비하기
## 1-1. 테스트를 하는 이유
* 자신이 만든 서비스가 제대로 동작하는지 테스트해야 한다.
    * 기능이 많다면 수작업으로 테스트하기 힘들다.
    * 프로그램이 프로그램을 테스트할 수 있도록 자동화한다.
    * 테스트 환경을 최대한 실제 환경과 비슷하게 흉내낸다.
    * 아무리 철저하게 테스트해도 에러를 완전히 막을 수는 없다.
    * 스타트업의 경우 시간이 없어서 테스트를 못할 경우가 있다.
        * 그런 경우 회귀테스트라도 하는게 좋다.
* 테스트를 하면 좋은 점
    * 하지만 허무한 에러로 인해 프로그램이 고장나는 것은 막을 수 있음
    * 한 번 발생한 에러는 테스트로 만들어두면 같은 에러가 발생하지 않게 막을 수 있음
    * 코드를 수정할 때 프로그램이 자동으로 어떤 부분이 고장나는 지 알려줌

## 1-2. Jest 설치하기
* npm i –D jest
    * Nodebird 프로젝트를 그대로 사용함
```js
// package.json
...
"name": "nodebird",
  "version": "0.0.1",
  "description": "익스프레스로 만드는 SNS 서비스",
  "main": "app.js",
  "scripts": {
    "start": "nodemon app",
    "test" : "jest"
  },
```
## 1-3. 테스트 실행해보기
* routes 폴더 안에 middlewares.test.js 작성
    * 테스트용 파일은 파일명에 test나 spec이 있으면 됨
    * npm test로 test나 spec 파일들을 테스트함.
    * 테스트를 아무것도 작성하지 않았으므로 에러 발생(테스트 실패)

## 1-4. 첫 테스트 코드 작성하기
* middlewares.test.js 작성하기
    * test 함수의 첫 번째 인수로 테스트에 대한 설명
    * 두 번째 인수인 함수에는 테스트 내용을 적음
    * expect 함수의 인수로 실제 코드를, toEqual 함수의 인수로는 예상되는 결괏값을 적는다.
    * expect와 toEqual의 인수가 일치하면 테스트 통과
```js
test('1 + 1은 2입니다.', () => {
    expect(1+1).toEqual(3);
});
```
## 1-5. 실패하는 경우
* 두 인수를 다르게 작성하면 실패(메시지를 살펴볼 것)
    * 어느 부분에서 테스트가 실패하는지 알려준다.
```js
test('1 + 1은 2입니다.', () => {
    expect(1+1).toEqual(3);
});
```
```
// 로그
 FAIL  routes/middlewares.test.js
  × 1 + 1은 2입니다. (3 ms)

  ● 1 + 1은 2입니다.

    expect(received).toEqual(expected) // deep equality

    Expected: 3
    Received: 2

      1 | test('1 + 1은 2입니다.', () => {
    > 2 |     expect(1+1).toEqual(3);
        |                 ^
      3 | });

      at Object.<anonymous> (routes/middlewares.test.js:2:17)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.753 s
Ran all test suites.
npm ERR! Test failed.  See above for more details.
```

# 2. 유닛 테스트
* 함수안에 다른 함수가 있어도된다.
* 떼어낼수 있는 하나의 단위를 테스트하는 것을 단위 테스트 또는 유닛 테스트라고 한다.
## 2-1. middlewares 테스트하기
* middlewares.test.js 작성하기
    * 테스트 틀 잡기
    * describe로 테스트 그룹화 가능
```js
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

// 그룹화
describe('isLoggedIn', () => {
    test('로그인되어 있으면 isLoggedIn이 next를 호출해야 한다.', () => {
        
    });
    test('로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 한다.', () => {
        
    });
});
describe('isNotLoggedIn', () => {
    test('로그인되어 있지면 isNotLoggedIn이 에러를 응답해야 한다.', () => {
        
    });
    test('로그인되어 있으면 isNotLoggedIn이 next를 호출해야 한다.', () => {
        
    });
});
```
## 2-2. req, res 모킹하기
* 미들웨어 테스트를 위해 req와 res를 가짜로 만들어주어야 함
    * 가짜로 만들어주는 행위를 모킹이라고 함.
    * jest.fn으로 함수 모킹 가능
```js
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

// 그룹화
describe('isLoggedIn', () => {
    const res = {
        status : jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();
    test('로그인되어 있으면 isLoggedIn이 next를 호출해야 한다.', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        isLoggedIn(req,res,next);
        expect(next).toBeCalledTimes(1);
    });
    test('로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 한다.', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isLoggedIn(req,res,next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
});
...
```
## 2-3. expect 메서드
* expect에는 toEqual 말고도 많은 메서드를 지원한다.
    * toBeCalledWith로 인수 체크
    * toBeCalledTimes로 호출 회수 체크
```js
...
describe('isNotLoggedIn', () => {
    const res = {
        status : jest.fn(() => res),
        send: jest.fn(),
        redirect: jest.fn(),
    };
    const next = jest.fn();
    test('로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 한다.', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        const message = encodeURIComponent('로그인한 상태입니다.');
        isNotLoggedIn(req,res,next);
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });
    test('로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 한다.', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isNotLoggedIn(req,res,next);
        expect(next).toBeCalledTimes(1); 
    });
});
```
## 2-4. 라우터 테스트 위해 분리하기
* 라우터도 미들웨어이므로 분리해서 테스트 가능
* routes/user.js를 다음과 같이 수정
* controllers/user.js 생성
```js
// routes/user.js
const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { addFollowing } = require('../controllers/user');

const router = express.Router();

// POST /user/1/follow
router.post('/:id/follow', isLoggedIn, addFollowing);

module.exports = router;
```

## 2-5. 라우터 테스트
* Controllers/user.test.js 작성하기
    * 데이터베이스가 없어서 오류가 난다.
```js
const { addFollowing } = require('./user');

describe('addFollowing',() => {
    const req = {
        user: { id: 1 },
        params: { id: 2 },
    };
    const res = {
        status : jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();
    
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
        await addFollowing(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });
    test('사용자를 못 찾으면 res.status(404).send(no user)를 호출 함', async () => {
        await addFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');

    });
    test('DB에서 에러가 발생하면 next(err) 호출', async () => {
        const error = '테스트용 에러';
        await addFollowing(req, res, next);
        expect(next).toBeCalledWith(error);

    });
});
```
## 2-6. DB 모킹하기
* Jest를 사용해 모듈 모킹 가능(jest.mock)
    * 메서드에 mockReturnValue 메서드가 추가되어 리턴값 모킹 가능
```js
const { addFollowing } = require('./user');
// 모킹 require할 모델보다 위에 있어야한다.
jest.mock('../models/user');
const User = require('../models/user');

describe('addFollowing',() => {
    const req = {
        user: { id: 1 },
        params: { id: 2 },
    };
    const res = {
        status : jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();
    
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
        // 리턴값을 가짜로 만들어준다. 무조건 mockReturnValue 안의 값이 리턴된다.
        User.findOne.mockReturnValue(Promise.resolve({ 
            id: 1, 
            name: 'zerocho', addFollowings(value) {
                return Promise.resolve(true);
            }
        }));
        await addFollowing(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });
    test('사용자를 못 찾으면 res.status(404).send(no user)를 호출 함', async () => {
        User.findOne.mockReturnValue(Promise.resolve(null));
        await addFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');

    });
    test('DB에서 에러가 발생하면 next(err) 호출', async () => {
        const error = '테스트용 에러';
        // reject하면 try catch애서 catch로 간다.
        User.findOne.mockReturnValue(Promise.reject(error));
        await addFollowing(req, res, next);
        expect(next).toBeCalledWith(error);

    });
});
```
# 3. 테스트 커버리지
## 3-1. 테스트 커버리지란?
* 전체 코드 중에서 테스트되고 있는 코드의 비율
    * 테스트되지 않는 코드의 위치도 알려준다.
    * jest –coverage
    * Stmts: 구문
    * Branch: 분기점
    * Funcs: 함수
    * Lines: 줄 수
* 등록후 콘솔에 npm run coverage
```js
// package.json
{
  "name": "nodebird",
  "version": "0.0.1",
  "description": "익스프레스로 만드는 SNS 서비스",
  "main": "app.js",
  "scripts": {
    "start": "nodemon app",
    "test" : "jest",
    // 추가
    "coverage" : "jest --coverage"
  },
...
```

## 3-2. 테스트 커버리지 올리기
* models/users.test.js작성

## 3-3. 테스트 커버리지 주의점
* 모든 코드가 테스트되지 않는데도 커버리지가 100%임
    * 테스트 커버리지를 맹신할 필요가 없음
    * 커버리지를 높이는 것이 의미는 있지만 높이는 데 너무 집착할 필요는 없음
    * 필요한 부분 위주로 올바르게 테스트하는 것이 좋음

# 4. 통합 테스트
## 4-1. 통합 테스트 해보기
* 라우터 하나를 통째로 테스트해 봄(여러 개의 미들웨어, 모듈을 한 번에 테스트).
    * app.js 분리하기
        * app.js 맨 아래 listen부분을 지우고 module.exports = app; 추가
        * server.js를 생성해서 아래와 같이 코딩
        * package.json에 start부분 수정
* npm i -D supertest
* supertest는 요청을 모킹한다.
    * 가짜 요청을 보내고 가짜 요청을 응답해서 시뮬레이션 한다.
```js
// app.js
...
// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    // 템플릿 엔진에서 message랑 error라는 변수
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
```
```js
// server.js
const app = require('./app');

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
```
## 4-2. 테스트용 DB 설정하기
* 개발/배포용 DB랑 별도로 설정하는 것이 좋음
    * config/config.json의 test 속성
    * 콘솔에 npx sequelize db:create --env test
```js
// config/config.json
...
"test": {
    "username": "root",
    "password": "비밀번호",
    "database": "nodebird_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
...
```
## 4-3. 라우터 테스트
* routes/auth.test.js 작성
    * beforeAll: 모든 테스트 전에 실행
    * request(app).post(주소)로 요청
    * send로 data 전송
```js
// routes/auth.test.js
const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
    await sequelize.sync();
});

describe('POST /login', () => {
    test('로그인 수행', async (done) => {
        request(app)
            .post('/auth/login')
            .send({
                email: 'zerocho@gmail.com',
                password: 'nodejsbook',
            })
            .expect('Location', '/')
            .expect(302, done);
    })
});
```
## 4-4. 회원 정보부터 만들기
* routes/auth.test.js 수정
    * 테스트 실행하면 성공함
    * 재차 실행하면 실패함
        * 데이터가 중복되기 때문에

## 4-5. afterAll로 정리하기
* routes/auth.test.js 수정
    * afterAll은 테스트가 종료된 후에 실행됨
    * DB 초기화하기

## 4-6. 로그아웃 테스트하기
* routes/auth.test.js 수정
    * beforeEacah는 테스트 직전에 실행

# 5. 부하 테스트
## 5-1. 부하 테스트란?
* 서버가 얼마만큼의 요청을 견딜 수 있는지 테스트
    * 서버가 몇 명의 동시 접속자를 수용할 수 있는지 예측하기 매우 어려움
    * 실제 서비스 중이 아니라 개발 중일 때는 더 어려움
    * 코드에 문제가 없더라도 서버 하드웨어 때문에 서비스가 중단될 수 있음(메모리 부족 문제 등)
    * 부하 테스트를 통해 미리 예측할 수 있음
```js
// 콘솔
npm i -D artillery
npm start
```
## 5-2. Artillery 사용하기
* 하나의 콘솔은 서버를 시작해놓는다.
* 새 콘솔에서 다음 명령어 입력
    * npx artillery quick --count 100 -n 50 http://localhost:8001
    * Count 옵션은 가상의 사용자 수
    * N 옵션은 횟수
    * 100명의 사용자가 50번씩 요청을 보내는 상황
* 결과 보고서
    * 사용자 생성(scenarios launched)
    * 테스트 성공(scenarios completed)
    * 요청 성공 횟수(requests completed)

    * 초당 요청 처리 횟수(RPS sent)
    * 응답 지연 속도(Request latency)
    * Min: 최소, Max: 최대, median: 중앙값
    * P95: 하위 95%, P99: 하위 99%
        * 하위는 속도 순서를 말함
    * Median과 P95가 많이 차이나지 않는 게 좋음

## 5-3. 여러 페이지 요청 시나리오
* loadtest.json에 사용자의 행동 흐름 작성 가능
    * target: 요청 도메인
    * Phases에서 duration: 몇 초 동안(60초)
    * arrivalRate: 매 초 몇 명(30명)
    * flow: 사용자의 이동
    * get, post 등의 메서드를 나타냄
    * url은 이동한 url
    * json은 서버로 전송한 데이터
    * 현재 GET /, POST /auth/login, GET /hashtag 순
* loadtest.json 참조
* 공식문서 : https://artillery.io/docs/ 참조
* https://onlineyamltools.com/convert-yaml-to-json 사이트에서 YAML을 json으로 바꿀 수 있다.

## 5-4. 여러 페이지 요청 시나리오(실행)
* 문제점 발견
    * 요청 후반부가 될 수록 응답 시간이 길어짐
    * 첫 응답은 4.7밀리초, 마지막 응답은 51초
    * 5400개의 요청은 200 응답코드, 1800개는 302
    * 서버가 지금 정도의 요청을 감당하지 못함
    * 서버 사양을 업그레이드하거나, 여러 개 두거나
    * 코드를 더 효율적으로 개선하는 방법 등.
    * 현재는 싱글코어만 사용하므로, 클러스터링 기법 도입을 시도해볼만 함
    * arrivalRate를 줄이거나 늘려서 어느 정도 수용 가능한지 체크해보는 것이 좋음
    * 여러 번 테스트하여 평균치를 내보는 게 좋음
* npx artillery run loadtest.json

## 5-5. 테스트 범위
* 어떤 것을 테스트하고 어떤 것을 테스트 안 할 지 고민됨.
    * 자신이 짠 코드는 최대한 많이 테스트하기
    * npm을 통해 설치한 패키지는 테스트하지 않음(그걸 만든 사람의 몫임)
    * 우리는 그 패키지/라이브러리를 사용하는 부분만 테스트
    * 테스트하기 어려운 패키지는 모킹
    * 모킹해서 통과하더라도 실제 상황에서는 에러날 수 있음을 염두에 두어야 함

    * 시스템 테스트: QA처럼 테스트 목록을 두고 체크해나가면서 진행하는 테스트
    * 인수 테스트: 알파 테스트/베타 테스트처럼 특정 사용자 집단이 실제로 테스트
    * 다양한 종류의 테스트를 주기적으로 수행해 서비스를 안정적으로 유지하는 게 좋음

# 스스로 해보기
* 모든 함수에 대한 유닛 테스트 작성하기(테스트 커버리지 100% 도전하기)
* 모든 라우터에 대한 통합 테스트 작성하기
* 부하 테스트를 통해 병목점 및 개선점 찾기

# 핵심 정리
* 테스트를 작성한다고 해서 에러가 발생하지 않는 것은 아니다. 하지만 자신의 코드에 대한 믿음을 가질 수 있다.
* 테스트를 올바르게 작성하지 않으면 테스트를 하지 않는 것보다 못한 상황이 발생한다.
* 테스트를 작성하면 나중에 코드 변경 사항이 생겼을 때 어떤 부분에 영향을 미치는지 쉽게 파악할 수 있다. 이러한 긍정적인 영향과 테스트하는 데 필요한 공수를 함께 고려해서 테스트할 범위를 정해야 한다.
* 실제 서비스에는 모든 기능을 테스트하기 어렵기 때문에 우선순위를 정하여 우선순위가 높은 기능 위주로 테스트한다.
* 테스트 커버리지가 100%라고 해서 에러가 발생하지 않는 것은 아니다.