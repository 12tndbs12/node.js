웹 API 서버 만들기
==================
# 1. API 서버 이해하기
## 1-1. NodeBird SNS 서비스
* 9 장 NodeBird 서비스의 API 서버를 만든다.
* API : Application Programming Interface
    * 다른 애플리케이션에서 현재 프로그램의 기능을 사용할 수 있게 함.
    * 웹 API: 다른 웹 서비스의 기능을 사용하거나 자원을 가져올 수 있게 함.
    * 다른 사람에게 정보를 제공하고 싶은 부분만 API를 열고, 제공하고 싶지 않은 API를 만들지 않으면 됨.
    * API에 제한을 걸어 일정 횟수 내에서만 가져가게 할 수도 있음.
    * NodeBird에서는 인증된 사용자에게만 정보 제공
    * 크롤링을 하면 관리가 안되지만 API를 사용하면 관리가 가능하다.
* 예를 들어, 인스타 그램을 크롤링을 할때 잘못할 경우 디도스가 될 수 있다. 그럴 경우 API를 제공해서 해결한다.
# 2. 프로젝트 구조 갖추기
## 2-1. NodeBird API 폴더 세팅
* nodebird-api 폴더를 만들고 package.json 생성
    * 생성 후 npm i로 패키지 설치
    * NodeBird에서 config, models, passport 모두 복사해서 nodebird-api에 붙여넣기
    * routes 폴더에서는 auth.js와 middlewares 재사용
    * .env 파일 복사
    * views 폴더를 만들고 error.html 파일 생성
