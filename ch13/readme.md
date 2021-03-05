실시간 경매 시스템 만들기
=========================
# 1. 프로젝트 구조 갖추기
## 1-1. NodeAuction 프로젝트
* node-auction 폴더를 만든 후 그 안에 package.json 작성
    * npm i로 필요한 패키지 설치
    * 데이터베이스는 MySQL
    * 시퀄라이즈 설치 및 기본 디렉터리 만듦
```json
// package.json
{
	"name": "node-auction",
	"version": "0.0.1",
	"description": "노드 경매 시스템",
	"main": "app.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"author": "rkdden",
	"license": "ISC",
	"dependencies": {
		"cookie-parser": "^1.4.5",
		"dotenv": "^8.2.0",
		"express": "^4.17.1",
		"express-session": "^1.17.1",
		"morgan": "^1.10.0",
		"multer": "^1.4.2",
		"mysql2": "^2.2.5",
		"nunjucks": "^3.2.3",
		"sequelize": "^6.5.0",
		"sequelize-cli": "^6.2.0"
	}
}
```
```
<!-- 콘솔 -->
npx sequelize init
```
## 1-2. 모델 작성하기
* models/user.js, models/good.js, models/auctions.js 작성
	* 소스 코드는 https://github.com/ZeroCho/nodejs-book/tree/master/ch13/13.1/node-auction
	* user.js: 사용자 이메일, 닉네임, 비밀번호와 자금(money)
	* good.js: 상품의 이름과 사진, 시작 가격
	* auction.js: 입찰가(bid)와 msg(입찰 시 전달할 메시지)
	* config/config.json에 MySQL 데이터베이스 설정 작성
## 1-3. 데이터베이스 생성하기
* npx sequelize db:create로 nodeauction 데이터베이스 생성
	* npx를 사용하면 글로벌 설치를 안 해도 됨
## 1-4. DB 관계 설정하기
* models/index.js
	* 한 사용자가 여러 상품을 등록 가능(user-good, as: owner)
	* 한 사용자가 여러 상품을 낙찰 가능(user-good, as: sold)
	* 한 사용자가 여러 번 경매 입찰 가능(user-auction)
	* 한 상품에 대해 여러 번 경매 입찰 가능(good-auction)
	* as로 설정한 것은 OwnerId, SoldId로 상품 모델에 컬럼이 추가됨
## 1-5. passport 세팅하기
* passport와 passport-local, bcrypt 설치
	* passport/localStrategy.js, passport./index.js 작성(9장과 거의 동일)
	* 카카오 로그인은 하지 않음
	* 로그인을 위한 미들웨어인 routes/auth.js, routes/middlewares.js도 작성
## 1-6. .env와 app.js 작성하기
* .env와 app.js 작성
	* 소스 코드는 <https://github.com/ZeroCho/nodejs-book/tree/master/ch13/13.1/node-auction> (9장의 app.js와 거의 동일)
	* .env에 COOKIE_SECRET=auction 추가
## 1-7. views 파일 작성하기
* views 폴더에 layout.html, main.html, join.html, good.html 작성
	* 소스 코드는 <https://github.com/ZeroCho/nodejs-book/tree/master/ch13/13.1/node-auction>
	* layout.html: 전체 화면의 레이아웃(로그인 폼)
	* main.html : 메인 화면을 담당(경매 목록이 있음)
	* join.html: 회원가입 폼
	* good.html: 상품을 업로드하는 화면(이미지 업로드 폼)
	*public/main.css도 추가
## 1-8. routes/index.js
* routes/index.js 작성
	* GET /는 메인 페이지(경매 리스트) 렌더링
	* GET /join은 회원가입 페이지
	* GET /good은 상품 등록 페이지
	* POST /good 상품 등록 라우터
## 1-9. 서버 실행하기
* localhost:8018에 접속
	* 회원가입 후 로그인하고 상품 등록해보기