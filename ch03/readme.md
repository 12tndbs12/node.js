노드 기능 알아보기
==================
# 1.REPL 사용하기
## 1-1 REPL 사용하기
* 노드는 REPL이라는 콘솔을 제공한다
* R(Read), E(Evaluate), P(Print), L(Loop)
* 코드를 읽고, 해석하고, 결과물을 반환하고, 종료할 때까지 반복한다.
* 윈도우는 cmd, 맥이나 리눅스는 터미널에 node를 입력한다.
    * VS Code는 ctrl + ` 을 누르면 터미널을 연다.
    * VS Code에서 터미널 기본을 cmd로 바꾼다.
* 프롬프트가 > 모양으로 바뀌면, 자바스크립트 코드 입력
* 입력한 값의 결괏값이 바로 출력됨.
    * 간단한 코드를 테스트하는 용도로 적합
    * 긴 코드를 입력하기에는 부적합
* 나갈때는 ctrl + c, ctrl + c를 누르면 나간다.

# 2. JS 파일 실행하기
## 2-1. JS 파일을 만들어 실행하기
* 자바스크립트 파일을 만들어서 코드를 실행하는 방법
    * 아무디렉터리에 ex01_1.js를 만든후
    * node [자바스크립트 파일 경로]로 실행한다.
    *  실행 결괏값이 출력됨

# 3. 모듈로 만들기
## 3-1. 모듈
* 노드는 자바스크립트 코드를 모듈로 만들 수 있다.
    * **모듈**이란? 특정한 기능을 하는 함수나 변수들의 집합이다.
    * 모듈로 만들면 여러 프로그램에서 재사용이 가능하다.
## 3-2. 모듈 만들어보기
* 같은 폴더 내에 var.js func.js index.js 를 만든다.
    * 파일 끝에 module.exports로 모듈로 만들 값을 지정한다.
        * module.exports는 파일에서 **단 한번**만 써야한다.
    * 다른 파일에서 require(파일 경로)로 그 모듈의 내용을 가져올 수 있다.
## 3-3. 파일 간의 모듈 관계
* node index로 실행
    * const { odd, even } 부분은 module.exports를 구조분해 할당한 것임(2장 참고)
## 3-4. ES2015 모듈
* 자바스크립트 자체 모듈 시스템 문법이 생겼다
    * 아직 노드에서의 지원은 완벽하지 않음. mjs 확장자를 사용해야 함.
    * 크게는 require 대신 import, module.exports 대신 export default를 쓰는것으로 바뀌었다.
```js
    import { odd, even } from './var';
    function checkOddOrEven(num) {
        if (num % 2) {
            retrun odd;
        }
        return even;
    }
    export default checkOddOrEven;
```
# 4. 노드 내장 객체 알아보기
* 선언하지 않아도 기본적으로 node 안에 내장되어있다.
## 4-1. global
* 노드의 전역 객체
    * 브라우저의 window 같은 역할이다.
    *  모든 파일에서 접근이 가능하다.
    * window처럼 생략도 가능하다. (console, require도 global의 속성이다.)
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
## 4-2. global 속성 공유
* global 속성에 값을 대입하면 다른 파일에서도 사용이 가능하다.
    * 하지만 헷갈릴수 있기 때문에 모듈을 사용하는 것을 권장한다.
## 4-3. console 객체
* 브라우저의 console 객체와 매우 유사하다.
    * console.time, console.timeEnd : 시간 로깅
        * 둘 사이의 시간을 잴수 있다. 효율성을 따질 때 사용
    * console.error: 에러 로깅
    * console.log : 평범한 로그
    * console.dir : 객체 로깅
        * ex) console.dir({hello : 'hello'});
    * console.trace : 호출스택 로깅
## 4-4. console 예제 실행
* node console.js
## 4-5. 타이머 메서드
* set 메서드에 clear 메서드가 대응됨
    * set 메서드의 리턴 값(아이디)을 clear 메서드에 넣어 취소
* 이 세개의 메서드는 백그라운드로 보내주는 대표적인 비동기 메서드이다.
    * setTimeout(콜백 함수, 밀리초) : 주어진 밀리초(1000분의 1초) 이후에 콜백 함수를 실행한다.
    * setInteral(콜백 함수, 밀리초) : 주어진 밀리초마다 콜백 함수를 반복 실행한다.
    * setImmediate(콜백 함수) : 콜백 함수를 즉시 실행한다.
* 위 세개를 취소하는 메서드
    * clearTimeout(아이디) : setTimeout을 취소한다.
    * clearInterval(아이디) : setInterval을 취소한다.
    * clearImmediate(아이디) : setImmediate를 취소한다.
## 4-6. 타이머 예제
* ex04/timer.js 참조
    * setTimeout(콜백, 0)보다 setImmediate 권장
## 4-7. __filename, __dirname
* 노드는 브라우저와 다르게 컴퓨터에 접근이 가능하다.
* __filename : 현재 파일 경로
* __dirname : 현재 폴더(디렉터리) 경로
```js
console.log(__filename);
console.log(__dirname);
```
## 4-8. module, exports
* module.exports 외에도 exports로 모듈을 만들 수 있다.
    * 모듈 예제의 var.js를 다음과 같이 바꾼 후 실행
    * 동일하게 동작함
    * 동일한 이유는 module.exports와 exports가 참조 관계이기 때문
    * 동일한 이유는 module.exports와 exports가 참조 관계이기 때문
    * 참조관계가 깨지는 걸 주의 해야 한다.
    * module.exports에 함수를 대입한 경우는 exports로 바꿀 수 없다.
```js
// ex03의 var.js
// module을 생략 가능하다.
exports.odd = '홀수입니다.';
exports.even = '짝수입니다.';
// module.exports = { odd, even }; 과 같다
```

## 4-9. this
* 노드에서 this를 사용할 때에는 주의점이 있다.
    * 최상위 스코프의 this는 module.exports를 가리킨다.
    * 그 외에는 브라우저의 자바스크립트와 동일하다
    * 함수 선언문 내부의 this는 global(전역) 객체를 가리킨다.
```js
console.log(this);  // {}
console.log(this === module.exports); // true
function a() {
    console.log(this === global);   // true
}
a();
```
## 4-10. require의 특성
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
## 4-11. 순환참조
* 두 개의 모듈이 서로를 require하는 상황을 조심해야 함
    * Dep1이 dep2를 require하고, dep2가 dep1을 require 함.
    * Dep1의 module.exports가 함수가 아니라 빈 객체가 됨(무한 반복을 막기 위해 의도됨)
    * 순환참조하는 상황이 나오지 않도록 하는 게 좋음
    * 따라서 구조를 잘 짜야한다.
```js
// dep1.js
const dep2 = require('./dep2');
console.log('require dep2', dep2);
module.exports = () => {
    console.log('dep2', dep2);
};
// dep2.js
const dep1 = require('./dep1');
console.log('require dep1', dep1);
module.exports = () => {
    console.log('dep1', dep1);
};
// dep-run.js
const dep1 = require('./dep1');
const dep2 = require('./dep2')
dep1();
dep2();
```
##  4-12. process
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
### 4-13. process.env
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

### 4-14. process.nextTick(콜백)
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
### 4-15. process.exit(코드)
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
## 5-4. 알아둬야할 path 관련 정보
*  join과 resolve의 차이: resolve는 /를 절대경로로 처리, join은 상대경로로 처리
    * 상대 경로: 현재 파일 기준. 같은 경로면 점 하나(.), 한 단계 상위 경로면 점 두 개(..)
    * 절대 경로는 루트 폴더나 노드 프로세스가 실행되는 위치가 기준
```js
path.join('/a', '/b', 'c');     // 결과: /a/b/c 
path.resolve('/a', '/b', 'c');  // 결과: /b/c
```
* \\와 \ 차이: \는 윈도 경로 구분자, \\는 자바스크립트 문자열 안에서 사용(\가 특수문    자라 \\로 이스케이프 해준 것)

* 윈도에서 POSIX path를 쓰고 싶다면: path.posix 객체 사용
    * POSIX에서 윈도 path를 쓰고 싶다면: path.win32 객체 사용

## 5-5. url
* 인터넷 주소를 쉽게 조작하도록 도와주는 모듈이다.
    * url 처리에는 크게 2가지 방식이 있다. (기존 노드 방식, WHATWG 방식)
    * 아래 그림에서 가운데 주소를 기준으로 위쪽은 기존 노드 바아식, 아래쪽은 WHATWG 방식이다.
* url.js
```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```
## 5-6. url 모듈 메서드
* 기존 노드 방식 메서드
    * url.parse(주소): 주소를 분해합니다. WHATWG 방식과 비교하면 username과 password대신 auth 속성이 있고, searchParams 대신 query가 있습니다.
    * url.format(객체): WHATWG 방식의 url과 기존 노드의 url 모두 사용할 수 있습니다. 분해되었던 url 객체를 다시 원래 상태로 조립합니다.

## 5-7. searchParams
* WHATWG 방식에서 쿼리스트링(search) 부분 처리를 도와주는 객체이다.
    * ?page=3&limit=10&category=nodejs&category=javascript 부분
* searchParam.js 참조
* 메서드
    * getAll(키) : 키에 해당하는 모든 값들을 가져온다.
    * get(키) : 키에 해당하는 첫 번째 값만 가져온다.
    * has(키) : 해당 키가 있는지 없는지를 검사한다.
    * keys() : searchParams의 모든 키를 반복기 객체로 가져온다.
    * values() : searchParams의 모든 값를 반복기 객체로 가져온다.
    * append(키, 값) : 해당 키를 추가한다. 같은 키의 값이 있으면 유지하고 하나 더 추가한다.
    * set(키, 값) : append와 비슷하지만, 같은 키의 값을 모두 지우고 새로 추가한다.
    * delete(키) : 해당 키를 제거한다.
    * toString() : 조작한 searchParams 객체를 다시 문자열로 만든다. 이 문자열을 search에 대입하면 주소 객체에 반영된다.

## 5-8. querystring
* 기존 노드의 url을 사용할 때 search 부분을 사용하기 쉽게 객체로 만드는 모듈이다.
    * querystring.parse(쿼리) : url의 query부분을 자바스크립트 객체로 분해해준다.
    * querystring.stringify(객체) : 분해된 query 객체를 문자열로 다시 조립해준다.
```js
// querystring.js
const url = require('url');
const querystring = require('querystring');

const parseUrl = url.parse('http://www.gitbut.co.kr/?page=3&limit=10&category=nodejs&category=javascript');
const query = querystring.parse(parseUrl.query);
console.log('querystring.parse():', query);
console.log('querystring.stringfy():', querystring.stringfy(query));
```
## 5-9. crypto
* 암호화는 가능하지만 복호화는 불가능하다.
    * 암호화 : 평문을 암호로 만드는것.
    * 복호화 : 암호를 평문으로 해독

* 단방향 암호화의 대표 주자는 해시 기법이다.
    * 문자열을 고정된 길이의 다른 문자열로 바꾸는 방식
    * abcdefgh 문자열 -> qvew

## 5-10. Hash 사용하기(sha512)
* createHash(알고리즘) : 사용할 해시 알고리즘을 넣어준다.
    * md5, sha1, sha256, sha512 등이 가능하지만, md5와 sha1은 이미 취약점이 발견되었습니다.
    * 현재는 sha512 정도로 충분하지만, 나중에 sha512마저도 취약해지면 더 강화된 알고리즘으로 바꿔야 합니다.
* update(문자열) : 변환할 문자열을 넣어준다.
* digest(인코딩) : 인코딩할 알고리즘을 넣어준다.
    * base64, hex, latin1이 주로 사용되는데, 그 중 base64가 결과 문자열이 가장 짧아 애용된다. 결과물로 변환된 문자열을 반환한다.
```js
const crypto = require('crypto');
console.log('base64:', crypto.createHash('sha512').update('비밀번호').digest('base64'));
console.log('hex:', crypto.createHash('sha512').update('비밀번호').digest('hex'));
console.log('base64:', crypto.createHash('sha512').update('다른 비밀번호').digest('base64'));
```
## 5-11.  pbkdf2
* 컴퓨터의 발달로 기존 암호화 알고리즘이 위협받고 있다.
    * sha512가 취약해지면 sha3로 넘어가야한다.
    * 현재는 pbkdf2나, bcrypt, scrypt 알고리즘으로 비밀번호를 암호화
    * Node는 pbkdf2와 scrypt를 지원한다.

## 5-12. pbkdf2 예제
* crypto.randomBytes로 64바이트 문자열 생성 -> salt 역할
* pbkdf2 인수로 순서대로 비밀번호, salt, 반복 횟수, 출력 바이트, 알고리즘
* 반복 횟수를 조정해 암호화하는 데 1초 정도 걸리게 맞추는 것이 권장됨
```js
const cryto = require('crypto');
cryto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    console.log('salt:', salt);
    cryto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
        console.log('password:', key.toString('base64'));
    });
});
```

## 5-13. 양방향 암호화
* 대칭형 암호화(암호문 복호화 가능)
    * Key가 사용된다.
    * 암호화할 때와 복호화 할 때 같은 Key를 사용해야 한다.
* p.127

## 5-14. util
* 각종 편의 기능을 모아둔 모듈
    * deprecated와 promisify가 자주 쓰인다.
* util.deprecated : 함수가 deprecated 처리되었음을 알려준다.
    * 첫 번째 인자로 넣은 함수를 사용했을 때 경고 메세지를 출력한다.
    * 두 번째 인자로 경고 메세지 내용을 넣는다. 함수가 조만간 사라지거나 변경될 때 알려줄 수 있어 유용하다.
* util.promisify : 콜백 패턴을 프로미스 패턴으로 바꿔준다.
    * 바꿀 함수를 인자로 제공하면 된다. 이렇게 바꾸어두면 async/await 패턴까지 사용할 수 있다. 단 콜백이 (error, data) => {} 형식이어야 한다.
```js
const util = require('util');
const crypto = require('crypto');

const dontUseMe = util.deprecate((x, y) => {
    console.log(x + y);
    }, 'dontUseMe 함수는 deprecated되었으니 더 이상 사용하지 마세요!');
dontUseMe(1, 2);

const randomBytesPromise = util.promisify(crypto.randomBytes);
randomBytesPromise(64)
  .then((buf) => {
    console.log(buf.toString('base64'));
  })
  .catch((error) => {
    console.error(error);
  });
```
## 5-15. worker_threads
* 노드에서 멀티 스레드 방식으로 작업을 할 수 있게 지원하는 모듈
    * 잘 안쓰이고, 복잡하다
    * 예제 worker_threads.js 참조
    * prime.js는 일반 방식, prime_worker.js는 멀티 스레드 방식이다.
    *  isMainThread: 현재 코드가 메인 스레드에서 실행되는지, 워커 스레드에서 실행되는지 구분
    * 메인 스레드에서는 new Worker를 통해 현재 파일(__filename)을 워커 스레드에서 실행시킴
    * worker.postMessage로 부모에서 워커로 데이터를 보냄
    * parentPort.on(‘message’)로 부모로부터 데이터를 받고, postMessage로 데이터를 보냄    

## 5-16. 여러 워커스레드 사용하기
*  new Worker 호출하는 수만큼 워커 스레드가 생성됨
    * worker_data.js 참조

## 5-17. child_process
* 노드에서 다른 프로그램을 실행하고 싶거나 명령어를 수행하고 싶을 때 사용하는 모듈이다.
    * 현재 노드 프로세스 외에 새로운 프로세스를 띄워서 명령을 수행함.
    * 명령 프롬프트의 명령어인 dir을 노드를 통해 실행(리눅스라면 ls를 대신 적을 것)
* 이 모듈을 통해 다른 언어의 코드를 실행하고 결괏값을 받을 수 있다.
```js
const exec = require('child_process').exec;

var process = exec('dir');

process.stdout.on('data', function(data) {
  console.log(data.toString());
}); // 실행 결과

process.stderr.on('data', function(data) {
  console.error(data.toString());
}); // 실행 에러
```
* 파이썬 프로그램 실행하기
    * 파이썬3이 설치되어 있어야 함.
* spawn.js와 test.py 참조

## 5-18. 기타 모듈들
* assert : 값을 비교하여 프로그램이 제대로 동작하는지 테스트하는 데 사용한다.
* dns : 도메인 이름에 대한 IP주소를 얻어내는 데 사용한다.
* net : HTTP보다 로우 레벨인 TCP나 IPC 통신을 할 때 사용한다.
* string_decoder : 버퍼 데이터를 문자열로 바꾸는 데 사용한다.
* tls : TLS와 SSL에 관련된 작업을 할 떄 사용한다.
* tty : 터미널과 관련된 작업을 할 떄 사용한다.
* dgram : UDP와 관련된 작업을 할 때 사용한다.
* v8 : V8 엔진에 직접 접근할 때 사용한다.
* vm : 가상 머신에 직접 접근할 대 사용한다.

# 6. 파일 시스템 접근하기
## 6-1. fs
* 파일 시스템에 접근하는 모듈이다
    * 파일/폴더 생성, 삭제, 읽기, 쓰기가 가능하다.
    * 웹 브라우저에서는 제한적이었으나 노드는 권한을 가지고 있다.
    * 파일 읽기 예제(결과의 버퍼는 뒤에서 설명함)
    * readme.txt, readFile.js 참조
## 6-2. fs 프로미스
* 콜백 방식 대신 프로미스 방식으로 사용 가능
    * require(‘fs’).promises
    * 사용하기 훨씬 더 편해서 프로미스 방식을 추천함
    * readFile.js 참조
## 6-3. fs로 파일 만들기
* 파일을 만드는 예제
    * writeFile.js 참조
## 6-4. 동기 메서드와 비동기 메서드
* 노드는 대부분의 내장 모듈 메서드를 비동기 방식으로 처리
    * 비동기는 코드의 순서와 실행 순서가 일치하지 않는 것을 의미
    * 일부는 동기 방식으로 사용 가능
    * 참조 코드 콘솔 예측해보기
    * async.js 참조
    * async.js를 여러번 실행하면 실행 할 때마다 순서가 바뀐다.
* 동기와 비동기: 백그라운드 작업 완료 확인 여부
* 블로킹과 논 블로킹: 함수가 바로 return 되는지 여부
* 노드에서는 대부분 동기-블로킹 방식과 비동기-논 블로킹 방식임.
## 6-5. 동기 메서드 사용하기
* sync.js 참조
* 동기방식은 서버를 처음 실행할 때 정도 쓴다. (쓸때 주의해야함)
## 6-6. 비동기 메서드로 순서 유지하기
* 비동기작업을하며 순서를 유지하는것을 추천. (asyncOrder.js)
    * sync.js 와의 차이점 : sync.js는 순서대로 실행되지만, asyncOrder.js는 백그라운드에서 동시에 실행된다.
    * 하지만 콜백헬이 발생할 수 있기 때문에 asyncOrderPromise.js 처럼 프로미스로 바꿔준다.

## 6-9. 버퍼와 스트림 이해하기
* **버퍼** : 일정한 크기로 모아두는 데이터
    * 일정한 크기가 되면 한 번에 처리한다.
    * 버퍼링 : 버퍼에 데이터가 찰 떄까지 모으는 작업
* **스트림** : 데이터의 흐름
    * 일정한 크기로 나눠서 여러 번에 걸쳐서 처리한다.
    * 버퍼의 크기를 작게 만들어서 주기적으로 데이터를 전달한다.
    * 스트리밍 : 일정한 크기의 데이터를 지속적으로 전달하는 작업이다.
## 6-10. 버퍼 사용하기
* 노드에서는 버퍼를 사용할 때 Buffer 객체를 사용한다.
    * buffer.js 참조
## 6-11. Buffer의 메서드
* 노드에서는 Buffer 객체 사용
    * from(문자열) : 문자열을 버퍼로 바꿀 수 있다. length 속성은 버퍼의 크기를 바이트 단위로 알린다.
    * toString(버퍼) : 버퍼를 다시 문자열로 바꿀 수 있다. 이때 base64나 hex를 인수로 넣으면 해당 인코딩으로도 변환이 가능하다.
    * concat(배열) : 배열 안에 든 버퍼들을 하나로 합친다.
    * alloc(바이트) : 빈 버퍼를 생성한다. 바이트를 인수로 넣으면 해당 크기의 버퍼가 생성된다.
* **pipe** : 스트림끼리 연결하는 것

## 6-12. 파일 읽는 스트림 사용하기
* fs.createReadStream
    * createReadStream에 인자로 파일 경로와 옵션 객체 전달
    * highWaterMark 옵션은 버퍼의 크기(바이트 단위, 기본값 64KB)
    * data(chunk 전달), end(전달 완료), error(에러 발생) 이벤트 리스너와 같이 사용
    * createReadStream.js 참조

## 6-13. 파일 쓰는 스트림 사용하기
* fs.createWriteStream
    * createReadStream에 인자로 파일 경로 전달
    * write로 chunk 입력, end로 스트림 종료
    * 스트림 종료 시 finish 이벤트 발생
    * createWriteStream.js 참조
## 6-14. 스트림 사이에 pipe 사용하기
* pipe로 여러 개의 스트림을 이을 수 있음
    * 스트림으로 파일을 복사하는 예제
    * pipe.js 참조
## 6-15. 여러 개의 스트림 연결하기
* pipe로 여러 개의 스트림을 이을 수 있음
    * 파일을 압축한 후 복사하는 예제
    * 압축에는 zlib 내장 모듈 사용(createGzip으로 .gz 파일 생성)
    * gzip.js 참조
## 6-16. 큰 파일 만들기
* 1GB 정도의 파일을 만들어 봄.
    * createWriteStream으로 만들어야 메모리 문제가 생기지 않음.
    * createBigFile.js 참조
## 6-17. 메모리 체크하기
* 버퍼 방식과 스트림 방식 메모리 사용량을 비교해보기
    * 버퍼는  한번에 메모리에 올리는 반면 스트리밍은 잘라서 보내기 때문에 메모리를 아낄 수 있다.
* buffer-memory.js 참조
```
// console
before :  19451904      // 처음 메모리 용량
buffer :  1020485632    // 버퍼는 모두 메몰에 올린다. 1GB
```
* stream-memory.js 참조
```
// console
before :  19415040
stream :  34254848      // 메모리가 효율적이다.
```
## 6-18. 기타 fs 메서드
* fs.access(경로, 옵션, 콜백) : 폴더나 파일에 접근할 수 있는지를 체크한다.
* fs.mkdir(경로, 콜백) : 폴더를 만드는 메서드이다. 이미 폴더가 있으면 에러가 나기 때문에 access 메서드로 확인한다.
* fs.open(경로, 옵션, 콜백) : 파일의 아이디를 가져오는 메서드이다. 파일이 없으면 생성한 뒤에 아이디르르 가져온다.
* fs.rename(기존 경로, 새 경로, 콜백) : 파일의 이름을 바꾸는 메서드이다.
* fs.readdir(경로, 콜백) : 폴더 안의 내용물을 확인할 수 있다.
* fs.unlink(경로, 파일) : 파일을 지울 수 있다. 파일이 없다면 에러가 난다.
* fs.rmdir(경로, 콜백) : 폴더를 지울 수 있다. 안에 파일들이 있다면 에러가 난다.
* 노드 8.5 버전 이후 createReadStream과 createWriteStream을 pipe하지 않아도 파일을 복사 할 수 있다.
* fsCreate.js참조
* fsDelete.js 참조

* 파일을 복사하는 방법
```js
// copyFile.js
const fs = require('fs').promises;

fs.copyFile('readme4.txt', 'writeme4.txt')
.then(() => {
    console.log('복사 완료');
})
.catch((error) => {
    console.error(error);
});
```
* fs.watch : 파일을 감시하는 방법이다. 변경 사항이 발생 시 이벤트를 호출한다.
```js
const fs = require('fs');
fs.watch('./target.txt', (eventType,filename) => {
    console.log(eventType, filename);
});
// 내용물을 수정하면 change 이벤트가 발생한다.
// 파일명을 변경하거나 파일을 삭제하면 rename 이벤트가 발생한다.
// rename 이벤트가 발생한 후에는 더 이상 watch가 수행되지 않는다.
```
* fs.existsSync : 파일이나 폴더가 존재하는지
* fs.stat : 파일의 종류를 확인할 수 있다. (파일, 폴더, 심볼릭링크 등)
* 공식 문서가 짱

## 6-19. 스레드풀 알아보기
* fs, crypto, zlib 모듈의 메서드를 실행할 때는 백그라운등서 동시에 실행된다.
    * 스레드풀이 동시에 처리해준다.
    * 노드는 기본적으로 코어를 4개씩 돌린다.
* threadpool.js 참조
```js
2 1098
1 1111
4 1112
3 1112
// 잠깐 끊김
// 1 ~ 4 그룹
5 2221
8 2239
6 2336
7 2355
// 5 ~ 8 그룹
```
## 6-20. UV_THREAD_SIZE
* 스레드풀을 직접 컨트롤할 수는 없지만 개수 조절은 가능
    * 윈도우라면 터미널에 SET UV_THREADPOOL_SIZE=개수
    * 맥, 리눅스라면 UV_THREADPOOL_SIZE=개수
    * 이전 예제를 스레드풀 개수를 바꾼 뒤 재실행해보기
    * 자신의 컴퓨터 사양에 맞게 조절하면 효율적으로 동시작업이 가능하다.
```js
2 1194
6 1232
1 1330
8 1395
3 1433
4 1449
5 1509
7 1525
// 안끊김
// 1 ~ 8 그룹
```
# 7. 이벤트 이해하기
## 7-1. 이벤트 만들고 호출하기
* events 모듈로 커스텀 이벤트를 만들 수 있음
    * 스트림을 배울 때 사용했던 on('data', 콜백), on('end', 콜백)은 data와 end라는 이벤트가 발생할 때 콜백 함수를 호출하도록 이벤트를 등록한 것이다.
    * 직접 이벤트를 만들 수도 있다.
* 주요 메서드
    * on(이벤트명, 콜백) : 이벤트 이름과 이벤트 발생 시의 콜백을 연결한다. 여러개를 달 수도 있다.
    * addListener(이벤트명, 콜백) : on과 기능이 같다.
    * emit(이벤트명) : 이벤트를 호출하는 메서드이다.
    * once(이벤트명, 콜백) : 한 번만 실행되는 이벤트이다.
    * removeAllListener(이벤트명) : 이벤트에 연결된 모든 이벤트 리스너를 제거한다.
    * removeListener(이벤트명, 리스너) : 이벤트에 연결된 리스너를 하나씩 제거한다.
    * off(이벤트명, 콜백) : removeListener와 기능이 같다.
    * listenerCount(이벤트명) : 현재 리스너가 몇 개 연결되어 있는지 확인한다.
* event.js 참조
# 8. 에외 처리하기
## 8-1. 예외 처리
* **예외(Exception)** : 처리하지 못한 에러이다
    * 노드 스레드를 멈춘다.
    * 노드는 기본적으로 싱글 스레드이기 때문에 스레드가 멈추면 프로세스가 멈추는 것이다.
    * 에러 처리는 필수이다.
## 8-2. try catch 문
* 기본적으로 try catch문으로 예외를 처리한다.
    * 예외가 발생할 만한 곳을 try catch로 감싼다.
```js
// error1.js
setInterval(() => {
    console.log('시작');
    try {
        throw new Error('서버를 고장낸다!');
    }catch (err) {
        console.error(err);
    }
}, 1000);
```
## 8-3. 노드 비동기 메서드의 에러
* 노드 비동기 메서드의 에러는 따로 처리하지 않아도 된다.
    * 콜백 함수에서 에러 객체를 제공한다.
```js
// error2.js
const fs = require('fs');

setInterval(() => {
    fs.unlink('./abcdefg.js', (err) => {
        if (err) {
            console.error(err);
        }
    });
}, 1000);
```
## 8-4. 프로미스의 에러
* 프로미스의 에러는 따로 처리하지 않아도 된다.
    * 버전이 올라가면 동작이 바뀔 수 있다.
    * catch를 붙이는 습관을 들이자
    * 경고가 나타날수 있다.
```js
const fs = require('fs').promises;

setInterval(() => {
    fs.unlink('./abcedfg.js')
}, 1000);
```
## 8-5. 예측 불가능한 에러 처리하기
* 최후의 수단으로 사용

* 에러를 한번에 처리하는법
    * 최후의 수단으로만 사용한다.
    * 콜백 함수의 동작이 보장되지 않는다.
    * 따라서 복구 작업용으로 쓰는 것은 부적합하다.
    * 에러 내용 기록용으로만 쓰는 게 좋다.
```js
process.on('uncaughtException', (err) => {
    console.error('예기치 못한 에러', err);
});
setInterval(() => {
    throw new Error('서버를 고장낸다!');
}, 1000);

setTimeout(() => {
    console.log('실행된다.');
}, 2000);
```
# 9. 프로세스 종료하기
* 윈도우
    * netstat -ano | findstr 포트
    * taskkill /pid 프로세스아이디 /f

* 맥/리눅스
    * lsof -i tcp:포트
    * kill -9 프로세스아이디