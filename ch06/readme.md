익스프레스 웹 서버 만들기
=========================
# 1. 익스프레스 프로젝트 시작하기
## 1-1. Express 소개
* http 모듈로 웹 서버를 만들 때 코드가 보기 좋지 않고, 확장성도 떨어진다.
    * 프레임워크로 해결한다
    * 대표적인 것이 Express, Koa, Hapi가 있다. (express가 가장 많이 쓰인다.)
    * 코드 관리도 용이하고 편의성이 많이 높아진다.
* <npmtrends.com>
## 1-2. package.json 만들기
* 직접 만들거나 npm init 명령어 생성
    * nodemon이 소스 코드 변경 시 서버를 재시작해준다.
* npm i express
* npm i -D nodemon
## 1-3. app.js 작성하기
* 서버 구동의 핵심이 되는 파일이다.
    * app.set('port', 포트)로 서버가 실행될 포트를 지정한다.
    * app.get(‘주소’, 라우터)로 GET 요청이 올 때 어떤 동작을 할지 지정한다.
    * app.listen(‘포트’, 콜백)으로 몇 번 포트에서 서버를 실행할지 지정한다.

## 1-4. 서버 실행하기
* app.js : 핵심 서버 스크립트이다.
* public : 외부에서 접근 가능한 파일들 모아둔다
* views : 템플릿 파일을 모아둔다.
* routes : 서버의 라우터와 로직을 모아둔다.
    * 추후에 models를 만들어 데이터베이스를 사용한다.

## 1-5. 익스프레스 서버 실행하기
* npm start 콘솔에서 실행
* nodemon이 전역적으로 설치되지 않았으면 npx nodemon app

## 1-6. HTML 서빙하기
* res.sendFile로 HTML 서빙이 가능하다.

