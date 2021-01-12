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




