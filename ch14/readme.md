CLI 프로그램 만들기
===================
# 1. 간단한 콘솔 명령어 만들기
## 1-1. CLI
* CLI(Command Line Interface) 기반 노드 프로그램을 제작해보기
    * 콘솔 창을 통해서 프로그램을 수행하는 환경
    * 반대 개념으로는 GUI(그래픽 유저 인터페이스)가 있음
    * 리눅스의 셸이나 브라우저 콘솔, 명령 프롬프트 등이 대표적인 CLI 방식 소프트웨어
    * 개발자에게는 CLI 툴이 더 효율적일 때가 많음
## 1-2. 콘솔 명령어
* 노드 파일을 실행할 때 node [파일명] 명령어를 콘솔에 입력함
    * node나 npm. nodemon처럼 콘솔에서 입력하여 어떠한 동작을 수행하는 명령어를 콘솔 명령어라고 부름.
    * node와 npm 명령어는 노드를 설치해야만 사용할 수 있음
    * nodemon, rimraf같은 명령어는 npm i –g 옵션으로 설치하면 명령어로 사용 가능
    * 패키지 명과 콘솔 명령어를 다르게 만들 수도 있음(sequelize-cli는 sequelize 명령어 사용)
    * 이러한 명령어를 만드는 게 이 장의 목표
## 1-3. 프로젝트 시작하기
* node-cli 폴더 안에 package.json과 index.js 생성
    * index.js 첫 줄의 주석에 주목(윈도에서는 의미 없음)
    * 리눅스나 맥 같은 유닉스 기반 운영체제에서는 /usr/bin/env에 등록된 node 명령어로 이 파일을 실행하라는 뜻
```js
// index.js
#!/usr/bin/env node
console.log('Hello CLI');
```
## 1-4. CLI 프로그램으로 만들기
* package.json에 다음 줄을 추가
    * bin 속성이 콘솔 명령어와 해당 명령어 호출 시 실행 파일을 설정하는 객체
    * 콘솔 명령어는 cli, 실행 파일은 index.js
```js
...
"license": "ISC",
  "bin": {
    "cli": "./index.js"
  }
```
## 1-5. 콘솔 명령어 사용하기
* npm i -g로 설치 후 cli로 실행
    * 보통 전역 설치할 때는 패키지 명을 입력하지만 현재 패키지를 전역 설치할 때는 적지 않음
    * 리눅스나 맥에서는 명령어 앞에 sudo를 붙여야 할 수도 있음
    * 전역 설치한 것이기 때문에 node_modules가 생기지 않음
## 1-6. 명령어에 옵션 붙이기
* process.argv로 명령어에 어떤 옵션이 주어졌는지 확인 가능(배열로 표시)
    * 코드가 바뀔 때마다 전역 설치할 필요는 없음
    * package.json 내용이 바뀌면 다시 전역 설치해야 함
    * 배열의 첫 요소는 노드의 경로, 두 번째 요소는 cli 명령어의 경로, 나머지는 옵션
```console
> cli one two three

Hello CLI [
  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Program Files\\nodejs\\node_modules\\node-cli\\index.js',
  'one',
  'two',
  'three'
]

```