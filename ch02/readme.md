알아두어야 할 자바스크립트
==========================
# 1. 호출 스택, 이벤트 루프
## 1.1 호출 스택
```js
function first() {
    second();
    console.log("첫번째");
}
function second() {
    third();
    console.log("두번째");
}
function third() {
    console.log("세번째");
}
first();
```
* 세 번째 -> 두 번째-> 첫 번째
    * 파일이 실행될때 기본적으로 anoymous가 쌓이고 이후 first, second, third순으로 쌓인다.
    * 실행은 역순으로 한다. (third, second, first)
* Anonymous는 가상의 전역 컨텍스트이다.
* 함수 호출 순서대로 쌓이고, 역순으로 실행된다.
* 함수 실행이 완료되면 스택에서 빠진다.
* LIFO 구조라서 스택이라고 불린다.
    * LIFO : Last In First out (나중에 들어간게 먼저 나오는것을 의미한다.)

## 1.2 이벤트 루프
* ch01 참고
* 강의 참고 (노드교과서 2-2. 이벤트 루프 알아보기)

# 2. const, let
* ES2015 이전에는 var로 변수를 선언했다.
* ES2015 부터는 const와 let이 대체했다.
* 가장 큰 차이점 : 블록 스코프(var는 함수 스코프이다.)
* var는 쓸 일이 없고, 알기만 하면된다.
```js
if(true){
    var x = 3;
}
console.log(x);     // 3

if(true){
    const y = 3;
}
console.log(y);     // Uncaught ReferenceError ~~~
```
## 2.1 const
* const는 한 번 값을 할당하면 다른 값을 할당할 수 없다.
* 먼저 const로 선언 후 나중에 필요하면 let으로 바꾸면 된다.
## 2.2 let
* let은 한 번 선언된 이후에도 다시 값을 할당할 수 있다.

# 3. 템플릿 문자열
* 기존 문자열은 큰따옴표 또는 작은따옴표로 감쌋지만 템플릿 문자열을 ` (백틱)을 사용해서 감싼다.
```js
const num1 = 1;
const num2 = 2;
const result = 3;
const string = `${num1} + ${num2} = '${result}'` ;
console.log(string);        // 1 + 2 = '3'

// 기존함수 호출
function a() {}
a();
a``; //얘도 가능
```

# 4. 객체 리터럴
* 훨씬 간결한 문법으로 객체 리터럴이 표현 가능하다
    * 객체의 메서드에 :function을 붙이지 않아도 된다.
    * { sayNode: sayNode}와 같은 것을 { sayNode }로 축약이 가능하다.
    * [변수+값] 등으로 동적 속성명을 객체 속성 명으로 사용이 가능하다.
```js
// 기존
var sayNode = function () {
    console.log("Node");
};
var es = "ES";
var oldObject = {
    sayJS : function () {
        console.log("js");
    },
    sayNode : sayNode
};
oldObject[es + 6] = 'Fantastic';
oldObject.sayNode();    // Node
oldObject.sayJS();      // JS
console.log(oldObject.ES6); //Fantastic

// ---------------------------------------------
// 추가된 문법
const newObject = {
    sayJS() {
        console.log("JS");
    },
    sayNode,
    [es + 6] : "Fantastic",
};
newObject.sayNode();    // Node
newObject.sayJS();      // JS
console.log(newObject.ES6);     // Fantastic
```

# 5. 화살표 함수
* add1, add2, add3, add4는 같은 기능을 하는 함수이다.
    * add2 : add1을 화살표 함수로 나타낼 수 있다.
    * add3 : 함수의 본문이 return만 있는 경우 return 생략
    * add4 : return이 생략된 함수의 본문을 소괄호로 감싸줄 수 있다.
    * not1과 not2도 같은 기능을 한다. (매개변수 하나일 때 괄호를 생략한다.)
```js
function add1(x, y) {
    return x + y;
}
const add2 = (x, y) => {
    return x + y;
};
const add3 = (x, y) => x + y;
const add4 = (x, y) => (x + y);

function not1(x) {
    return !x;
}
const not2 = x => !x;
```
* 화살표 함수가 기존 function() {}을 대체하는 건 아니다. (this가 다르기 때문)
* this를 쓸거면 function, this를 쓰지 않는다면 화살표함수를 권장한다.




















