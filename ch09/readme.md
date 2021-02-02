익스프레스로 SNS 서비스 만들기
==============================
# 1. 프로젝트 구조 갖추기
## 1-1. NodeBird SNS 서비스
* 기능: 로그인, 이미지 업로드, 게시글 작성, 해시태그 검색, 팔로잉
    * express-generator 대신 직접 구조를 갖춤
    * 프런트엔드 코드보다 노드 라우터 중심으로 보자
    * 관계형 데이터베이스 MySQL 사용
## 1-2. 프로젝트 시작하기
* nodebird 폴더를 만들고 package.json 파일 생성
    * package.json은 노드 프로젝트의 기본이다.
* 시퀄라이즈 폴더 구조를 생성한다.
```
// 콘솔
$ npm i sequelize mysql2 sequelize-cli
$ npx sequelize init
```
## 1-3. 폴더 구조 설정
* views(템플릿 엔진), routes(라우터), public(정적 파일), passport(패스포트) 폴더 생성
* app.js와 .env 파일도 생성

## 1-4. 패키지 설치와 nodemon
* npm 패키지 설치 후 nodemon도 설치
    * nodemon은 서버 코드가 변경되었을 때 자동으로 서버를 재시작해줌
    * nodemon은 콘솔 명령어이기 때문에 글로벌로 설치
```
$ npm i express express-session cookie-parser morgan nunjucks dotenv multer
$ npm i -D nodemon
```

## 1-5. app.js
* 노드 서버의 핵심인 app.js 파일 작성
    * 소스 코드는 https://github.com/zerocho/nodejs-book
    * .env도 같이 추가
