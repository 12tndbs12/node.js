노드 시작하기
=============
# 1. 노드의 정의
## 1.1 노드의 정의
* 공식 홈페이지 설명
    * Node.jsⓇ는 크롬 V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임입니다.
* 노드란?
    * 서버의 역할도 수행할 수 있는 자바스크립트 런타임
    * 노드로 자바스크립트로 작성된 서버를 실행 할 수 있음.
    * 서버 실행을 위해 필요한 http/https/http2 모듈을 제공한다.

## 1-2. 런타임
* 노드: 자바스크립트 런타임
    * 런타임 : 특정 언어로 만든 프로그램들을 실행할 수 있게 해주는 가상 머신(크롬의 V8 엔진 사용)의 상태
    * ∴ 노드: 자바스크립트로 만든 프로그램들을 실행할 수 있게 해 줌
    * 다른 런타임으로는 웹 브라우저(크롬, 엣지, 사파리, 파이어폭스 등)가 있다.
    * 노드 이전에도 자바스크립트 런타임을 만들기 위한 많은 시도가 있었다.
    * But, 엔진 속도 문제로 실패

## 1-3. 내부 구조
* 2008년  V8 엔진 출시, 2009년 노드 프로젝트 시작
* 노드는 V8과 libuv를 내부적으로 포함
    * V8 엔진: 오픈 소스 자바스크립트 엔진 -> 속도 문제 개선
    * libuv: 노드의 특성인 이벤트 기반, 논블로킹 I/O 모델을 구현한 라이브러리

# 2. 노드의 특성
## 2-1. 이벤트 기반
* 이벤트가 발생할 때 미리 지정해둔 작업을 수행하는 방식
    * 이벤트의 예: 클릭, 네트워크 요청, 타이머 등
    * 이벤트 리스너: 이벤트를 등록하는 함수
    * 콜백 함수: 이벤트가 발생했을 때 실행될 함수

## 2-2. 논블로킹 I/O
* 논 블로킹: 오래 걸리는 함수를 백그라운드로 보내서 다음 코드가 먼저 실행되게 하고, 나중에 오래 걸리는 함수를 실행
    * 논 블로킹 방식 하에서 일부 코드는 백그라운드에서 병렬로 실행됨
    * 일부 코드: I/O 작업(파일 시스템 접근, 네트워크 요청), 압축, 암호화 등
    * 나머지 코드는 블로킹 방식으로 실행됨
    * I/O 작업이 많을 때 노드 활용성이 극대화
* **논 블로킹**은 이전 작업이 완료될 때까지 대기하지 않고 다음 작업을 수행하고, **블로킹**은 이전 작업이 끝나야만 다음 작업을 수행하는 것을 의미한다.

## 2-3. 프로세스 vs 스레드
* 프로세스와 스레드
    * 프로세스 : 운영체제에서 할당하는 작업의 단위이며, 프로세스 간 자원 공유를 하지 않는다.
    * 스레드 : 스레드는 프로세스 내에서 실행되는 흐름의 단위이며, 부모 프로세스의 자원을 공유한다.
* 노드 프로세스는 멀티 스레드이지만 직접 다룰 수 있는 스레드는 하나이기 때문에 싱글 스레드라고 표현한다.
* 노드는 주로 멀티 스레드 대신 멀티 프로세스를 활용한다.
* 노드는 14버전부터 멀티 스레드 사용이 가능하다.
    * 멀티 스레딩의 단점 : 멀티 프로세싱보다 프로그래밍이 어렵다.
* 운영체제 안에 다수의 프로세스
    * 프로세스 안에 다수의 스레드
## 2-4. 싱글 스레드
* 싱글 스레드라 주어진 일을 하나밖에 처리하지 못한다.
    * 블로킹이 발생하는 경우 나머지 작업은 모두 대기해야 함 -> 비효율 발생
    * 주방에 비유(점원: 스레드, 주문: 요청, 서빙: 응답)
* 대신 논 블로킹 모델을 채택하여 일부 코드(I/O)를 백그라운드(다른 프로세스)에서 실행 가능
    * 요청을 먼저 받고, 완료될 때 응답함
    * I/O 관련 코드가 아닌 경우 싱글 스레드, 블로킹 모델과 같아짐
## 2-5. 멀티 스레드 모델과의 비교
* 싱글 스레드 모델은 에러를 처리하지 못하는 경우 멈춤
    * 프로그래밍 난이도 쉽고, CPU, 메모리 자원 적게 사용
* 멀티 스레드 모델은 에러 발생 시 새로운 스레드를 생성하여 극복
    * 단, 새로운 스레드 생성이나 놀고 있는 스레드 처리에 비용 발생
    * 프로그래밍 난이도 어려움
    * 스레드 수만큼 자원을 많이 사용함
* 점원: 스레드, 주문: 요청, 서빙: 응답

## 2-6. 멀티 스레드의 활용
* 노드 14버전
    * 멀티 스레드를 사용할 수 있도록 worker_threads 모듈 도입
    * CPU를 많이 사용하는 작업인 경우에 활용 가능
    * 멀티 프로세싱만 가능했던 아쉬움을 달래줌.
```
멀티 스레딩과 멀티 프로세싱 비교
            멀티 스레딩                    ㅣ     멀티 프로세싱
하나의 프로세스 안에서 여러개의 스레드 사용ㅣ 여러 개의 프로세스 사용
        CPU 작업이 많을 때 사용            ㅣ I/O 요청이 많을 때 사용
        프로그래밍이 어려움                ㅣ 프로그래밍이 비교적 쉬움
```
# 3. 노드의 역할
## 3-1. 서버로서의 노드
* **서버** : 네트워크를 통해 클라이언트에 정보나 서비스를 제공하는 컴퓨터 또는 프로그램을 의미한다.
* **클라이언트** : 서버에 요청을 보내는 주체이다. (브라우저, 데스크탑 프로그램, 모바일 앱, 다른 서버에 요청을 보내는 서버)
* 예시
    * 브라우저(클라이언트, 요청)가 길벗 웹사이트(서버, 응답)에 접속
    * 핸드폰(클라이언트)을 통해 앱스토어(서버)에서 앱 다운로드
* 노드 != 서버
* But, 노드는 서버를 구성할 수 있게 하는 모듈(4장에서 설명)을 제공
## 3-2. 서버로서의 노드
* 노드 서버의 장단점
* **장점**
    * 멀티 스레드 방식에 비해 컴퓨터 자원을 적게 사용한다.
    * I/O 작업이 많은 서버로 적합하다.
    * 멀티 스레드 방식보다 쉽다.
    * 웹 서버가 내장되어 있다.
    * 자바스크립트를 사용한다.
    * JSON 형식과 호환하기 쉽다. (JSON이 자바스크립트 형식이기 때문이다.)
* **단점**
    * 싱글 스레드라서 CPU코어를 하나만 사용한다.
    * CPU 작업이 많은 서버로는 부적합하다.
    * 하나뿐인 스레드가 멈추지 않도록 관리해야 한다.
    * 서버 규모가 커졌을 때 서버를 관리하기 어렵다.
    * 성능이 어중간하다.
* CPU 작업을 위해 AWS Lambda나 Google Cloud Functions같은 별도 서비스 사용
* 페이팔, 넷플릭스, 나사, 월마트, 링크드인, 우버 등에서 메인 또는 서브 서버로 사용

## 3-3. 서버 외의 노드
* 자바스크립트 런타임이기 때문에 용도가 서버에만 한정되지 않는다.
* 웹, 모바일, 데스크탑 애플리케이션에도 사용된다.
    * 웹 프레임워크 : Angular, React, Vue, Metror 등
    * 모바일 앱 프레임워크 : React Native
    * 데스크탑 개발 도구 : Electron(Atom, Slack, VSCode, Discord 등)

# 4. 개발 환경 설정하기
## 4-1. 노드 설치하기
* **~~폴더명, 사용자명에 한글 안쓰는걸 권장~~**
* **비주얼 스튜디오로 할것이기 때문에 비주얼 스튜디오 설치하기**
* 윈도우10 기준
    * <https://nodejs.org/> 접속
    * 원하는 버전설치
        * LTS : 기업을 위해서 3년간 지원하는 버전이다. 서버를 안정적으로 운영해야 할 경우 선택
        * Current : 최신 기능을 담고 있는 버전이다. 신기능이나 학습용으로 사용할 때 적합하다.
    * 설치중 Tools for Native Modules에서 체크박스 표시
    * 파워쉘 설치까지 끝난후 명령 프롬프트 실행
    * 명령 프롬프트에서 **node -v** 입력
    * 명령 프롬프트에서 **npm -v** 입력
    * 버전이 다 나오면 설치 성공 (에러 메세지가 나오면 노드를 처음부터 다시 설치)
    * **npm 업그레이드**
        * npm i -g npm
* 맥 기준
    * 맥 안씀
* 리눅스 기준
    * 리눅스 안씀

# 5. 함께 보면 좋은 자료
* 노드 공식 사이트 : <https://nodejs.org/ko/>
* 노드 공식 사이트의 가이드 : <https://nodejs.org/ko/docs/guides/>
* 노드에 대한 전반적인 설명 : <https://nodejs.dev/>
* 이벤트 루프 설명 : <https://nodejs.org/ko/docs/guides/event-loop-timers-and-nexttick/>
* 이벤트 루프에 대한 시각적 설명 : <https://latentflip.com/loupe/>