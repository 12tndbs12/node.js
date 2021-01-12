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




