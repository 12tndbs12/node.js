노드 기능 알아보기
==================
# 1.REPL 사용하기
* 노드는 REPL이라는 콘솔을 제공한다
* R(Read), E(Evaluate), P(Print), L(Loop)
* 코드를 읽고, 해석하고, 결과물을 반환하고, 종료할 때까지 반복한다.
* 윈도우는 cmd, 맥이나 리눅스는 터미널에 node를 입력한다.
    * VS Code는 ctrl + ` 을 누르면 터미널을 연다.
    * VS Code에서 터미널 기본을 cmd로 바꾼다.
* 그 이후 자바스크립트 문법을 사용가능
* 나갈때는 ctrl + c, ctrl + c를 누르면 나간다.

# 2. JS 파일 실행하기
* 자바스크립트 파일을 만들어서 코드를 실행하는 방법
    * 아무디렉터리에 ex01_1.js를 만든후
    * node [자바스크립트 파일 경로]로 실행한다.

# 3. 모듈로 만들기
* 노드는 자바스크립트 코드를 모듈로 만들 수 있다.
    * **모듈**이란? 특정한 기능을 하는 함수나 변수들의 집합이다.
    * 모듈로 만들면 여러 프로그램에서 재사용이 가능하다.
* 같은 폴더 내에 var.js func.js index.js 를 만든다.
    * 파일 끝에 module.exports로 모듈로 만들 값을 지정한다.
        * module.exports는 파일에서 **단 한번**만 써야한다.
    * 다른 파일에서 require(파일 경로)로 그 모듈의 내용을 가져올 수 있다.

## 3-1. ES2015 모듈
* 자바스크립트 자체 모듈 시스템 문법이 생겼다
    * 크게는 require 대신 import, module.exports 대신 export default를 쓰는것으로 바뀌었다.
# 4. 노드 내장 객체
* 선언하지 않아도 기본적으로 node 안에 내장되어있다.
## 4-1. global
* 노드의 전역 객체
    * 브라우저의 window 같은 역할이다.
    *  모든 파일에서 접근이 가능하다.
    * window처럼 생략도 가능하다. (console, require도 global의 속성이다.)
* global 속성에 값을 대입하면 다른 파일에서도 사용이 가능하다.
    * 하지만 헷갈릴수 있기 때문에 모듈을 사용하는 것을 권장한다.
```js
// globalA.js
module.exports = () => global.message;
// globalB.js
const A = require('./globalA');
global.message = '안녕하세요.';
console.log(A());
// 결과
// 안녕하세요.
```
## 4-2. console
* 브라우저의 console 객체와 매우 유사하다.
    * console.time, console.timeEnd : 시간 로깅
        * 둘 사이의 시간을 잴수 있다. 효율성을 따질 때 사용
    * console.error: 에러 로깅
    * console.log : 평범한 로그
    * console.dir : 객체 로깅
        * ex) console.dir({hello : 'hello'});
    * console.trace : 호출스택 로깅

## 4-3. 타이머 메서드
* 이 세개의 메서드는 백그라운드로 보내주는 대표적인 비동기 메서드이다.
    * setTimeout(콜백 함수, 밀리초) : 주어진 밀리초(1000분의 1초) 이후에 콜백 함수를 실행한다.
    * setInteral(콜백 함수, 밀리초) : 주어진 밀리초마다 콜백 함수를 반복 실행한다.
    * setImmediate(콜백 함수) : 콜백 함수를 즉시 실행한다.
* 위 세개를 취소하는 메서드
    * clearTimeout(아이디) : setTimeout을 취소한다.
    * clearInterval(아이디) : setInterval을 취소한다.
    * clearImmediate(아이디) : setImmediate를 취소한다.

## 4-4. __filename, __dirname
* 노드는 브라우저와 다르게 컴퓨터에 접근이 가능하다.
* **__filename** : 현재 파일 경로
* **__dirname** : 현재 폴더(디렉터리) 경로
```js
console.log(__filename);
console.log(__dirname);
```
## 4-5. module, exports
* module.exports 외에도 exports로 모듈을 만들 수 있다.
```js
// ex03의 var.js
// module을 생략 가능하다.
exports.odd = '홀수입니다.';
exports.even = '짝수입니다.';
// module.exports = { odd, even }; 과 같다
```
* 참조관계가 깨지는 걸 주의 해야 한다.
* module.exports에 함수를 대입한 경우는 exports로 바꿀 수 없다.

## 4-6. this
* 노드에서 this를 사용할 때에는 주의점이 있다.
    * 최상위 스코프의 this는 module.exports를 가리킨다.
    * 그 외에는 브라우저의 자바스크립트와 동일하다
    * 함수 선언문 내부의 this는 global(전역) 객체를 가리킨다.

## 4-7. require의 특성
* ~~꼭 지금 알 필요는 없고, 나중에 하다가 모르겠으면 와도 충분하다.~~
* require가 제일 위에 올 필요는 없다.
* require.cache에 한 번


