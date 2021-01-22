패키지 매니저
=============
# 1. npm 알아보기
## 1-1. npm이란
* Node Package Manager의 약자이다.
* 노드의 패키지 매니저이다.
* 다른 사람들이 만든 소스 코드들을 모아둔 저장소이다.
* 남의 코드를 사용하여 프로그래밍이 가능하다.
* 이미 있는 기능을 다시 구현할 필요가 없어서 효율적이다.
* 오픈 소스 생태계를 구성중이다.

* 패키지 : npm에 업로드된 노드 모듈
* 모듈이 다른 모듈을 사용할 수 있듯 패키지도 다른 패키지를 사용할 수 있다.
* 의존 관계라고 부른다.
# 2. package.json으로 패키지 관리하기
* **노드 프로젝트를 시작하기 전에는 폴더 내부에 무조건 package.json부터 만들고 시작해야 한다.**
## 2-1. package.json
* 현재 프로젝트에 대한 정보와 사용 중인 패키지에 대한 정보를 담은 파일이다.
    * 같은 패키지라도 버전별로 기능이 다를 수 있으므로 버전을 기록해두어야 한다.
    * 동일한 버전을 설치하지 않으면 문제가 생길 수 있다.
    * 노드 프로젝트 시작 전 package.json부터 만들고 시작한다(npm init)
* 프로젝트 폴더로 들어가서 npm init 입력
## 2-2. package.json 속성들
* package name: 패키지의 이름이다.
* version: 패키지의 버전이다.
* entry point: 자바스크립트 실행 파일 진입점이다.
* test command: 코드를 테스트할 때 입력할 명령어를 의미한다.
* git repository: 코드를 저장해둔 git 저장소 주소를 의미한다.
* keywords: 키워드는 npm 공식 홈페이지에서 패키지를 쉽게 찾을 수 있게 해준다.
* license: 해당 패키지의 라이센스를 넣는다.
* **package.json 파일 참조**

## 2-3. npm 스크립트
* npm init이 완료되면 폴더에 package.json이 생성된다.
* npm run [스크립트명]으로 스크립트를 실행한다.
* dependencies는 실제 배포까지 쓰이는 패키지를 저장하고
    * node i 패키지명
* devDependencies는 개발 할때만 쓰이는 패키지이다.
    * node i -D 패키지이름
* 모듈 폴더를 지운뒤에 npm i 를 입력하면 다시 설치된다.

## 2-4. 글로벌 패키지
* npm install --global 패키지명 또는 npm i -g 패키지명
    * 모든 프로젝트와 콘솔에서 패키지를 사용할 수 있다.
```
콘솔
> rimraf node_modules   // node_modules 폴더 삭제
```
* Error: EPERM: operation not permitted, mkdir 
    * 허가권 관련 오류시 vs code를 관리자 권한으로 실행하자.
* 요즘은 글로벌 설치를 기피한다.
    * 대신 npm i rimraf -D 처럼 개발자로 설치하고 npx로 대체한다.
    * ex) npx rimraf node_modules

# 3. 패키지 버전 이해하기
## 3-1. SemVer 버저닝
* 노드 패키지의 버전은 SemVer(유의적 버저닝) 방식을 따른다.
    * Major(주 버전), Minor(부 버전), Patch(수 버전)
    * 노드에서는 배포를 할 때 항상 버전을 올려야 한다.
    * Major는 하위 버전과 호환되지 않은 수정 사항이 생겼을 때 올린다.
    * Minor는 하위 버전과 호환되는 수정 사항이 생겼을 때 올린다.
    * Patch는 기능에 버그를 해결했을 때 올린다.
    * ex) "rimraf": "^3.0.2"
## 3-2 버전 기호 사용하기
* ^1.1.1: 패키지 업데이트 시 minor 버전까지만 업데이트 된다.(2.0.0버전은 안 됨)
    * ^1 과 같다.
* ~1.1.1: 패키지 업데이트 시 patch버전까지만 업데이트 됨(1.2.0버전은 안 됨)
* >=, <=, >, <는 이상, 이하, 초과, 미만.
    * 거의 쓰지 않는다.
* @latest는 최신 버전을 설치하라는 의미이다.
    * ex) npm i express@latest
* 실험적인 버전이 존재한다면 @next로 실험적인 버전 설치 가능(불안정함)
    * ex) npm i express@next
* 각 버전마다 부가적으로 알파/베타/RC 버전이 존재할 수도 있음(1.1.1-alpha.0, 2.0.0-beta.1, 2.0.0-rc.0)

# 4. 기타 npm 명령어
## 4-1. 기타 명령어
* npm cli document에서 볼 수 있다.
    * <https://docs.npmjs.com/cli/v6/commands>
* npm outdated: 어떤 패키지에 기능 변화가 생겼는지 알 수 있다.
    * npm update하면 package.json에 따라 업데이트 된다.
* npm uninstall 패키지명 : 패키지 삭제
* npm search 검색어 : npm 패키지를 검색할 수 있다.(npmjs.com에서 검색과 같다.)
* npm info 패키지명: 패키지의 세부 정보 파악이 가능하다.
* npm login: npm에 로그인을 하기 위한 명령어이다.(npmjs.com에서 회원가입이 필요하다.)
* npm whoami: 현재 사용자가 누구인지 알려준다.
* npm logout : 로그인한 계정을 로그아웃한다.
* npm version 버전: package.json의 버전을 올린다. (Git에 커밋도 함)
    * ex) npm version major : 메이저 버전만 올린다.
* npm deprecate [패키지명][버전] [메시지]: 패키지를 설치할 때 경고 메시지를 띄우게 한다.(오류가 있는 패키지에 적용)
* npm publish: 자신이 만든 패키지를 배포한다.
* npm unpublish --force: 자신이 만든 패키지를 배포 중단한다.(배포 후 72시간 내에만 가능하다.)
* npm ls 패키지명 : 내 프로젝트가 어떤 패키지를 사용하고 있는지 찾고 싶을 때 npm ls를 사용한다.

# 5. 패키지 배포하기
* npm회원가입
* 배포할 패키지 작성
* 배포 시도하기









