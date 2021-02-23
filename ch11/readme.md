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
