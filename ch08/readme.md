몽고디비
========
# 1. NoSQL vs SQL
## 1-1. NoSQL
* MySQL같은 SQL 데이터베이스와는 다른 유형의 데이터
    * NoSQL의 대표주자인 mongoDB(몽고디비)를 사용한다.
    * JOIN: 관계가 있는 테이블끼리 데이터를 합치는 기능이다.(몽고디비에서는 aggregate로 흉내가 가능하다.)
    * 빅테이터, 메시징, 세션 관리 등(비정형 데이터)에는 몽고디비를 사용하면 좋다.
```
           SQL          |             NOSQL
규칙에 맞는 데이터 입력 |   자유로운 데이터 입력
테이블간 JOIN 지원      |   컬렉션 간 JOIN 미지원
안정성, 일관성          |   확장성, 가용성
용어(테이블,로우,컬럼)  |   용어(컬렉션, 다큐먼트, 필드)
```
# 2. 몽고디비, 컴파스 설치하기
* 윈도우 : 공식 사이트(<https://www.mongodb.com/try/download/community>)
* 다운받고 실행
* Next를 눌러 다음으로 넘어가다가 Complete로 모든 프로그램 기능 설치
* Install MongoD as a Service 체크 해제하기
    * 체크하면 클라우드처럼 설치됨
* 컴퍼스도 같이 설치하는 옵션에 체크하여 설치
    * 워크벤치와 비슷한 기능을 함
## 2-1. 몽고디비 연결하기
* 설치 완료 후
    * 윈도의 경우 C:\에 data 폴더를 만들고 그 안에 db 폴더를 만듦
* 콘솔로 몽고디비가 설치된 경로(기본적으로 C:\Program Files\MongoDB\Server\4.2\bin)로 이동해 몽고디비를 실행    (mongod)
    * 다른 콘솔을 하나 더 열어 mongo 명령어 입력
## 2-2. 어드민 설정하기
* 어드민 권한을 설정하여 디비에 비밀번호 걸기
```
> use admin
switched to db admin
> db.createUser({ user: '이름', pwd: '비밀번호', roles: ['root'] })
Successfully added User : { user: '이름', pwd: '비밀번호', roles: ['root'] }
```
* mongod를 입력했던 콘솔을 종료한 후 mongod --auth 명령어로 접속
    * --auth는 로그인이 필요하다는 뜻
* mongo를 입력한 콘솔도 종료한 후 mongo admin –u 이름 –p 비밀번호로 접속
## 2-3. 커넥션 생성하기
*  컴퍼스(MongoDB Compass Community)로 접속
    * Fill in connection Fields individually 클릭
    * Authentication 을 Username/Password로 변경, 몽고디비 계정 이름과 비밀번호 입력
# 3. 데이터베이스, 컬렉션 생성하기
## 3-1. 데이터베이스 생성하기
* use 데이터베이스명으로 생성
```
> use nodejs
switched to db nodejs
```
* show dbs로 목록 확인
```
> show dbs
admin 0.000GB
config 0.000GB
local 0.000GB
```
* db로 현재 사용중인 데이터베이스 확인
```
> db
nodejs
```
## 3-2. 컬렉션 생성하기
* 따로 생성할 필요가 없다.
    * 다큐먼트를 넣는 순간 컬렉션도 자동 생성된다.
    * 직접 생성하는 명령어도 있다.
```
> db.createCollection('user')
{ "ok" : 1 }
> db.createCollection('comments')
{ "ok" : 1 }
```
* show collectinos로 현재 컬렉션 확인
```
> show collections
comments
users
```
# 4. CRUD 작업하기
## 4-1. Create
* 몽고디비는 컬럼을 정의하지 않아도 됨
    * 자유로움이 장점, 무엇이 들어올지 모른다는 단점
    * 자바스크립트의 자료형을 따름(차이점도 존재)
    * ObjectId: 몽고디비의 자료형으로 고유 아이디 역할을 함
    * save method로 저장한다.
```
> use nodejs;
switched to db nodejs
> db.users.save({ name: 'zero', age: 24, married: false, comment: '안녕하세요. 간단히 몽고 디비 사용 방법에 대해 알아봅시다.', createdAt: new Date() });
WriteResult({ "nInserted" : 1})
> db.users.save({ name: 'nero', age: 32, married: true, comment: '안녕하세요. zero 친구 nero입니다.', createdAt: new Date() });
WriteResult({ "nInserted" : 1})
```
* 컬렉션 간 관계를 강요하는 제한이 없으므로 직접 ObjectId를 넣어 연결
    * 사용자의 ObjectId를 찾은 뒤 댓글 컬렉션에 넣음
```
                     조건         보여줄 필드
> db.users.find({ name: 'zero' }, { _id: 1 })
{"_id" : ObjectId("6017c27cb7ea0d91a9fb3d5c") }

> db.comments.save({ commenter: ObjectId('6017c27cb7ea0d91a9fb3d5c'), comment: '안녕하세요. zero의 댓글입니다.', createdAt: new Date() });
WriteResult({ "nInserted" : 1})
```
## 4-2. Read
* find로 모두 조회, findOne으로 하나만 조회
```
> db.users.find({});

{ "_id" : ObjectId("6017c27cb7ea0d91a9fb3d5c"), "name" : "zero", "age" : 24, "married" : false, "comment" : "안녕하세요. 갼댠히 몽고 디비 사용 방법에 대해 알아봅시다. ", "createdAt" : ISODate("2021-02-01T18:00:00Z") }
{ "_id" : ObjectId("6017c3e4b7ea0d91a9fb3d5d"), "name" : "nero", "age" : 32, "married" : true, "comment" : "제로 친구 네로", "createdAt" : ISODate("2020-02-01T09:00:00Z") }

> db.comments.find({})
{ "_id" : ObjectId("6017c538b7ea0d91a9fb3d5e"), "commenter" : ObjectId("6017c27cb7ea0d91a9fb3d5c"), "comment" : "제로의 댓글입니다.", "created_at" : ISODate("2021-02-01T18:00:00Z") }
```
* 두 번째 인수로 조회할 필드를 선택할 수 있다.(1은 추가, 0은 제외)
```
// 아이디는 기본적으로 1이다.
> db.users.find({}, {_id: 0, name: 1, married: 1});
```
* 첫 번째 인수로 조회 조건 입력이 가능하다.
    * $gt나 $or같은 조건 연산자 사용
```
> db.users.find({ age: { $gt: 30}, married: true }, { _id: 0, name: 1, age: 1})

> db.users.find({ $or: [{age: { $gt: 30 } }, { married: true }] }, { _id: 0, name: 1, age: 1})
```
* 정렬은 sort 메서드로 한다
```
// 1이 오름차순, -1은 내림차순
> db.users.find({}, {_id:0, name: 1, age: 1}).sort({ age: -1 })
```
* limit 메서드로 조회할 다큐먼트 개수 제한
```
> db.users.find({}, {_id:0, name: 1, age: 1}).sort({ age: -1 }).limit(1)
```
* skip 메서드로 건너뛸 다큐먼트 개수 제공
```
> db.users.find({}, {_id:0, name: 1, age: 1}).sort({ age: -1 }).limit(1).skip(1)
```
## 4-3. Update
* update 메서드로 쿼리
    * 첫 번째 인수로 수정 대상을, 두 번째 인수로 수정 내용을 제공
    * $set을 붙이지 않으면 다큐먼트 전체가 대체되므로 주의
    * 결과로 수정된 개수가 나온다.
```
> db.users.update({name: 'nero'}, { $set: {comment: '안녕하세요. 이 필드를 바꿔보겠습니다.' } });
```
## 4-4. Delete
* remove 메서드로 쿼리
    * 첫 번째 인수로 삭제할 대상 조건 제공
    * 성공 시 삭제된 개수가 반환된다.
```
> db.users.remove({ name: 'nero' });
```