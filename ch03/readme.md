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
* require.cache에 한 번 require한 모듈에 대한 캐슁 정보가 들어있다.
* require.main은 노드 실행 시 첫 모듈을 가리킨다.
    * require.main으로 어떤 파일을 실행한건지 알아낼 수 있다.
```js
console.log('require가 가장 위에 오지 않아도 된다.');
module.exports = '저를 찾아보세요';
require('./var.js');

console.log('require.cache입니다.');
console.log(require.cache);
console.log('require.main입니다.');
console.log(require.main === module);
console.log(require.main.filename);
```
* 순환 참조(무한)일 경우 순환 참조되는 대상을 빈 객체로 만든다.
    * 따라서 구조를 잘 짜야한다.

##  4-8. process
* 현재 실행중인 노드 프로세스에 대한 정보를 담고 있다.
    * 컴퓨터마다 출력값이 다를 수 있다.
```js
// REPL에 입력
> process.version
v14.15.4 // 설치된 노드의 버젼
> process.arch
x64 // 프로세스 아키텍처 정보
> process.platform
win32   // 운영체제 플랫폼 정보이다.
> process.pid
18112   // 현재 프로세스의 아이디이다. 프로세스를 여러 개 가질 때 구분할 수 있다.
> process.uptime()
199.36  // 프로세스가 시작된 후 흐른 시간이다. 단위는 초이다.
> process.execPath
'C:\\Program Files\\nodejs\\node.exe'   //노드의 경로이다.
> process.cwd()
'C:\\Users\\ksy\\Desktop\\Node.js\\ch03\\ex04'  // 현재 프로세스가 실행되는 위치이다.
> process.cpuUsage()
{ user: 359000, system: 109000 }    // 현재 cpu 사용량이다.
```
### 4-8-1. process.env
* 시스템 환경 변수들이 들어있는 객체이다
    * 비밀키(데이터베이스 비밀번호, 서드파티 앱 키등)를 보관하는 용도로도 쓰인다.
    * 환경 변수는 process.env로 접근이 가능하다.
    ```js
    const secretId = process.env.SECRET_ID;
    const secretCode = process.env.SECRET_CODE;
    ```
    * 일부 환경 변수는 노드 실행 시에 영향을 미친다.
    * ex) NODE_OPTIONS(노드 실행 옵션), UV_THREADPOOL_SIZE(스레드풀 개수)
        * max-old-space-size는 노드가 사용할 수 있는 메모리를 지정하는 옵션

### 4-8-2. process.nextTick(콜백)
* 이벤트 루프가 다른 콜백 함수들보다 nextTick의 콜백 함수를 우선적으로 처리한다.
* 너무 남용하면 다른 콜백 함수들 실행이 늦어진다.
* 비슷한 경우로 promise가 있다. (nextTick처럼 우선순위가 높다.)
* 아래 예제에서 setImmediate, setTimeout보다 promise와 nextTick이 먼저 실행된다.
```js
setImmediate(() => {
    console.log('immediate');
});
process.nextTick(() => {
    console.log('nextTick');
});
setTimeout(() => {
    console.log('timeout');
}, 0);
Promise.resolve().then(() => console.log('promise');)

//결과
// nextTick
// promise
// timeout
// immediate
```
### 4-8-3. process.exit(코드)
* 현재의 프로세스를 멈춘다.
* 코드가 없거나 0이면 정상 종료
* 이외의 코드는 비정상 종료를 의미한다.
```js
//exit.js
    let i = 1;
    setInterval(() => {
        if (i === 5) {
            console.log('종료!');
            process.exit();
        }
        console.log(i);
        i += 1;
    }, 1000);
// 결과
// 1
// 2
// 3
// 4
// 종료!
```
# 5. 노드 내장 모듈 사용하기
* 공식 문서에 모두 나와 있지만 중요하고 자주 사용하는 것들만 소개한다.

## 5-1. os
* os는 운영체제의 정보를 담고 있다.
* 모듈은 require로 가져온다. (내장 모듈이기 때문에 경로 대신 이름만 적어줘도 된다.)
```js
const os = require('os');
console.log('운영체제 정보 -----------------------------------');
console.log(os.arch());         // process.arch와 동일
console.log(os.platform());     // process.platform과 동일
console.log(os.type());         // 운영체제의 종류
console.log(os.uptime());       // 운영체제 부팅 이후 흐른 시간을 보여준다.
console.log(os.hostname());     // 컴퓨터의 이름을 보여준다.
console.log(os.release());      // 운영체제의 버전을 보여준다.

console.log('경로---------------------------------------------');
console.log(os.homedir());      // 홈 디렉터리 경로를 보여준다.
console.log(os.tmpdir());       // 임시 파일 저장 경로를 보여준다.

console.log('cpu 정보-----------------------------------------');
console.log(os.cpus());         //  컴퓨터의 코어 정보를 보여준다.
console.log(os.cpus().length);  //  컴퓨터 코어의 갯수를 보여준다.

console.log('메모리 정보--------------------------------------');
console.log(os.freemem());      //  사용 가능한 메모리(RAM)를 보여준다.
console.log(os.totalmem());     //  전체 메모리 용량을 보여준다.
```
* nodejs.org에서 API Docs에서 OS를 찾아 볼 수 있다.

## 5-2. path
* 폴더와 파일의 경로를 쉽게 조작하도록 도와주는 모듈이다.
* 윈도우와 POSIX 운영체제들은 경로 구분자가 다르다.
* path 모듈은 그 경로 구분자를 자동으로 바꾸어준다.
* p.117확인
```js
const path = require('path');

const string = __filename;

console.log(path.sep);                  // 경로의 구분자이다.
console.log(path.delimiter);            // 환경 변수의 구분자 윈도우는(;) POSIX는(:)
console.log('-------------------------');
console.log(path.dirname(string));      // path.dirname(경로) : 파일이 위치한 폴더 경로를 보여준다.
console.log(path.extname(string));      //  파일의 확장자를 보여준다.
console.log(path.basename(string));     //  path.basename(경로, 확장자) : 파일의 이름(확장자 포함)을 표시한다.
console.log(path.basename(string, path.extname(string)));   // 파일의 이름만 표시하고 싶으면 두 번째 인수로 파일의 확장자를 넣으면 된다.
console.log('-------------------------');
console.log(path.parse(string));        // 파일 경로를 root, dir, base, ext, name 으로 분리한다.
console.log(path.format({
  root: 'C:\\',
  dir: 'C:\\Users\\ksy\\Desktop\\Node.js\\ch03\\ex05',
  base: 'path.js',
  ext: '.js',
  name: 'path'
}));    // path.parse()한 객체를 파일 경로로 합친다.
console.log(path.normalize('C:\\\Users\\\\\ksy\\\\Desktop\\\\Node.js\\ch03\\ex05'));    // /나 \를 실수로 여러 번 사용했거나 혼용했을 때 정상적인 경로로 변환한다.
console.log('-------------------------');
console.log(path.isAbsolute('C:\\'));   // 파일의 경로가 절대경로이면 true를 반환
console.log(path.isAbsolute('./home')); // 파일의 경로가 상대경로이면 false를 반환
console.log('-------------------------');
console.log(path.relative('C:\\Users\\ksy\\Desktop\\Node.js\\ch03\\ex05', 'C:\\')); // (기준경로, 비교경로) 경로를 두개 넣으면 첫 번째 경로에서 두번째 경로로 가는 방법을 알려줌
console.log(path.join(__dirname,'..','ex03','var.js')); // 여러 인수를 넣으면 하나의 경로로 합친다.
console.log(path.resolve(__dirname, '..', '/var.js'));  // join과 비슷하지만 /를 만나면 절대경로로 인식한다.
```