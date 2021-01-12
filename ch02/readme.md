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

# 6. 구조분해 할당
* this가 있을경우는 구조분해 할당을 사용안하는걸 권장한다.
```js
const example = {a: 123, b: {c: 135, d: 146}};
// 기존 문법
const a = example.a;
const d = example.b.d;
// 추가된 문법
const {a, b:{d}} = example;
console.log(a);     // 123
console.log(d);     // 146
```

```js
arr = [1,2,3,4,5]
// 기존 문법
const x = arr[0];
const y = arr[1];
const z = arr[4];
// 추가된 문법
const [x,y, , ,z] = arr;
```

# 7. 클래스
* 프로토타입 분법을 깔끔하게 작성할 수 있는 Class 문법 도입
    * Constructor(생성자), Extends(상속) 등을 깔끔하게 처리할 수 있다.
    * 코드가 그룹화되어 가독성이 향상된다.
* p.73

# 8. 프로미스
* 프로미스란 내용이 실행은 되었지만 결과를 아직 반환하지 않은 객체를 말한다.
* Then을 붙이면 결과를 반환한다.
* 실행이 완료되지 않았으면 완료된 후에 Then 내부 함수가 실행된다.
* 코드를 분리할 수 있다.
* 쉽게 설명하자면 실행은 바로 하고, 결괏값은 나중에 받는 객체이다.
```js
const condition = true; // true면 resolve, false면 reject
const promise = new Promise((resolve, reject) => {
    if(condition){
        resolve("성공");
    }else{
        reject("실패");
    }
});
// 다른 코드가 들어갈 수 있음.
    promise
        .then((message) => {
            console.log(message);   //  성공(resolve)한 경우 실행
        })
    .catch((error) => {
        console.error(error);   //  실패(reject)한 경우 실행
    })
    .finally(() => {
        console.log("무조건");  //  끝나고 무조건 실행
    });
```
* **Promise.resolve(성공리턴값)** : 바로 resolve하는 프로미스
* **Promise.reject(실패리턴값)** : 바로 reject하는 프로미스
* **Promise.all(배열)** : 여러 개의 프로미스를 동시에 실행한다.
    * 하나라도 실패하면 catch로 간다.
    * 최신으로는 allSettled로 실패한 것만 추려낼 수 있다.
```js
const promise1 = Promise.resolve("성공1");
const promise2 = Promise.resolve("성공2");
Promise.all([promise1, promise2])
    .then((result) = > {
        console.log(result);    //  ["성공1", "성공2"];
    })
    .catch((error) => {
        console.error(error);
    });

```




















