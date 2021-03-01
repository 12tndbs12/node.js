Node.js
=======
# 노드의 정의
* Node.js는 Chrome V8 Javascript 엔진으로 빌드된 Javascript 런타임이다.

# ch01
## 노드 시작하기
* 핵심 개념 이해하기
    * 서버
    * 자바스크립트 런타임
    * 이벤트 기반
    * 논 블로킹 I/O
    * 싱글 스레드
* 서버로서의 노드
* 서버외의 노드
* 개발 환경 설정
    * 노드 설치
    * npm 버전 업데이트
    * vscode 설치
# ch02
## 알아야 할 자바스크립트
* ES2015+
    * const, let
    * 템플릿 문자열
    * 객체 리터럴
    * 화살표 함수
    * 구조분해 할당
    * 클래스
    * 프로미스
    * async/await
* 프런트엔드 자바스크립트
    * AJAX
    * FormData
    * encodeURIComponent, decodeURIComponent
    * 데이터 속성과 dataset
# ch03
## 노드 기능 알아보기
* REPL 사용하기
* JS 파일 실행하기
* 모듈로 만들기
* 노드 내장 객체 알아보기
    * global
    * console
    * 타이머
    * __filename, __dirname
    * module, exports, require
    * process
* 노드 내장 모듈 사용하기
    * os
    * path
    * url
    * querystring
    * crypto
    * util
    * worker_threads
    * child_process
    * 기타 모듈들
* 파일 시스템 접근하기
    * 동기 메서드와 비동기 메서드
    * 버퍼와 스트림 이해하기
    * 기타 fs 메서드 알아보기
    * 스레드풀 알아보기
* 이벤트 이해하기
* 예외 처리하기
    * 자주 발생하는 에러들
# ch04
## http 모듈로 서버 만들기
* 요청과 응답 이해하기
* REST와 라우팅 사용하기
* 쿠키와 세션 이해하기
* https와 http2
* cluster
# ch05
## 패키지 매니저
* npm 알아보기
* package.json으로 패키지 관리하기
* 패키지 버전 이해하기
* 기타 npm 명령어
* 패키지 배포하기
# ch06
## 익스프레스 웹 서버 만들기
* 익스프레스 프로젝트 시작하기
* 자주 사용하는 미들웨어
    * morgan
    * static
    * body-parser
    * cookie-parser
    * express-session
    * 미들웨어의 특성 활용하기
    * multer
* Router 객체로 라우팅 분리하기
* req, res 객체 살펴보기
* 템플릿 엔진 사용하기
    * 퍼그(제이드)
    * 넌적스
    * 에러 처리 미들웨어
# ch07
## MySQL
* 데이터베이스란?
* MySQL 설치하기
    * 윈도우
* 워크벤치 설치하기
    * 윈도우
    * 커넥션 생성하기
* 데이터베이스 및 테이블 생성하기
    * 데이터베이스 생성하기
    * 테이블 생성하기
* CRUD 작업하기
    * Create
    * Read
    * Update
    * Delete
* 시퀄라이즈 사용하기
    * MySQL 연결하기
    * 모델 정의하기
    * 관계 정의하기
    * 쿼리 알아보기
    * 쿼리 수행하기
# ch08
## 몽고디비
* NoSQL vs SQL
* 몽고디비 설치하기
    * 윈도우
* 컴퍼스 설치하기
    * 윈도우
    * 커넥션 생성하기
* 데이터베이스 및 컬렉션 생성하기
* CRUD 작업하기
    * Create
    * Read
    * Update
    * Delete
* 몽구스 사용하기
    * 몽고디비 연결하기
    * 스키마 정의하기
    * 쿼리 수행하기
# ch09
## 익스프레스로 SNS 서비스 만들기
* 프로젝트 구조 갖추기
* 데이터베이스 세팅하기
* Passport 모듈로 로그인 구현하기
    * 로컬 로그인 구현하기
    * 카카오 로그인 구현하기
* multer 패키지로 이미지 업로드 구현하기
* 프로젝트 마무리하기
    * 스스로 해보기
    * 핵심 정리
# ch10
## 웹 API 서버 만들기
* API 서버 이해하기
* 프로젝트 구조 갖추기
* JWT 토큰으로 인증하기
* 다른 서비스에서 호출하기
* SNS API 서버 만들기
* 사용량 제한 구현하기
* CORS 이해하기
* 프로젝트 마무리하기
    * 스스로 해보기
    * 핵심 정리
# ch11
## 노드 서비스 테스트하기
* 테스트 준비하기
* 유닛 테스트
* 테스트 커버리지
* 통합 테스트
* 부하 테스트
* 프로젝트 마무리하기
    * 스스로 해보기
    * 핵심 정리
# ch12
## 웹 소켓으로 실시간 데이터 전송하기
* 웹 소켓 이해하기
* ws 모듈로 웹 소켓 사용하기
* Socket.IO 사용하기
* 실시간 GIF 채팅방 만들기
* 미들웨어와 소켓 연결하기
* 채팅 구현하기
* 프로젝트 마무리하기
    * 스스로 해보기
    * 핵심 정리
# ch13
## 실시간 경매 시스템 만들기
* 프로젝트 구조 갖추기
* 서버센트 이벤트 사용하기
* 스케줄링 구현하기
* 프로젝트 마무리하기
    * 스스로 해보기
    * 핵심 정리
# ch14
## CLI 프로그램 만들기
* 간단한 콘솔 명령어 만들기
* commander, inquirer 사용하기
* 프로젝트 마무리하기
    * 스스로 해보기
    * 핵심 정리
# ch15
## AWS와 GCP로 배포하기
* 서비스 운영을 위한 패키지
    * morgan과 express-session
    * 시퀄라이즈
    * cross-env
    * sanitize-html, csurf
    * pm2
    * winston
    * helmet, hpp
    * connect-redis
    * nvm, n
* 깃과 깃허브 사용하기
    * 깃 설치하기
    * 깃허브 사용하기
* AWS 시작하기
* AWS에 배포하기
* GCP 시작하기
* GCP에 배포하기
# ch16
## 서버리스 노드 개발
* 서버리스 이해하기
* AWS S3 사용하기
* AWS 람다 사용하기
* 구글 클라우드 스토리지 사용하기
* 구글 클라우드 펑션스 사용하기
# 출처 Node.js 교과서
# Node.js 교과서 참조

