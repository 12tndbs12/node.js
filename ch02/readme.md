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



