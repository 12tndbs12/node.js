MySQL
=====
# 1. 데이터베이스
## 1-1. 데이터베이스란
* 지금까지의 예제에서는 데이터를 서버 메모리에 저장했다.
    * 서버를 재시작하면 데이터도 사라져버린다. -> 영구적으로 저장할 공간이 필요함.
* MySQL 관계형 데이터베이스 사용
    * 데이터베이스 : 관련성을 가지며 중복이 없는 데이터들의 집합이다.
    * DBMS : 데이터베이스를 관리하는 시스템
    * RDBMS : 관계형 데이터베이스를 관리하는 시스템
    * 서버의 하드 디스크나 SSD 등의 저장 매체에 데이터를 저장
    * 서버 종료 여부와 상관 없이 데이터를 계속 사용할 수 있음
    * 여러 사람이 동시에 접근할 수 있고, 권한을 따로 줄 수 있음
# 2. MySQL, 워크벤치 설치하기
* 윈도우 공식 사이트(<https://dev.mysql.com/downloads/installer>)
* 다운로드 받은 MySQL installer 실행
    * 설치 진행중 Choosing a Setup Type 부분에서 Custom 선택
* 자신의 운영체제에서 Server와 Workbench만 선택하여 설치한다.
* 비밀번호 설정하기
* 설치 끝
## 2-1. MySQL 접속해보기
* 콘솔(CMD)에서 MySQL이 설치된 경로로 이동한다.
    * 기본 경로는 C:\Program Files\MySQL\MySQL Server 8.0\bin
    * -h는 호스트, -u는 사용자 –p는 비밀번호를 의미한다.
    * 프롬프트가 mysql> 로 바뀐다면 성공
```console
$ mysql -h localhost -u root -p
```
## 2-2. 워크벤치에서 커넥션 생성
* 워크벤치 프로그램 실행
* MySQL Connections 옆에 + 모양 클릭
* Connection Name에 localhost 적고 비밀번호 입력
* 설정했던 비밀번호를 입력하여 접속
# 3. 데이터베이스, 테이블 생성하기
## 3-1. 데이터베이스 생성하기.
* 콘솔에서 MySQL 프롬프트에 접속
    * CREATE SCHEMA nodejs;로 nodejs 데이터베이스를 생성한다.
    * use nodejs;로 생성한 데이터베이스를 선택한다.
    * MySQL에서는 SCHEMA와 데이터베이스를 같게 생각해도 괜찮다.
```
mysql> CREATE SCHEMA `nodejs` DEFAULT CHARACTER SET utf8;
```
## 3-2. 테이블 생성하기
* MySQL 프롬프트에서 테이블 생성
    * create table [데이터베이스명.테이블명]으로 테이블 생성
    * 사용자 정보를 저장하는 테이블
```
mysql> CREATE TABLE nodejs.users (
    -> id INT NOT NULL AUTO_INCREMENT,
    -> name VARCHAR(20) NOT NULL,
    -> age INT UNSIGNED NOT NULL,
    -> married TINYINT NOT NULL,
    -> comment TEXT NULL,
    -> created_at DATETIME NOT NULL DEFAULT now(),
    -> PRIMARY KEY(id),
    -> UNIQUE INDEX name_UNIQUE (name ASC))
    -> COMMENT = '사용자 정보'
    -> DEFAULT CHARACTER SET = utf8
    -> ENGINE = 'InnoDB';
```
* 오타를 걱정하는 경우 
    * workbench에서 해당 데이터베이스 클릭 -> Tables 우클릭 -> Create Table
    * 이곳에서 만들어도 무방하다.
## 3-3. 컬럼과 로우
* 나이 결혼 여부, 성별같은 정보가 컬럼
* 실제로 들어가는 데이터가 로우
## 3-4. 컬럼 옵션들
* id INT NOT NULL AUTO_INCREMENT
    * 컬럼명 옆의 것들은 컬럼에 대한 옵션들이다.
    * INT: 정수 자료형(FLOAT, DOUBLE은 실수)
    * VARCHAR: 문자열 자료형, 가변 길이(CHAR은 고정 길이)
    * TEXT: 긴 문자열은 TEXT로 별도 저장
    * DATETIME: 날짜 자료형 저장
    * TINYINT: -128에서 127까지 저장하지만 여기서는 1 또는 0만 저장해 불 값 표현
    * NOT NULL: 빈 값은 받지 않는다는 뜻(NULL은 빈 값 허용)
    * AUTO_INCREMENT: 숫자 자료형인 경우 다음 로우가 저장될 때 자동으로 1 증가
    * UNSIGNED: 0과 양수만 허용
    * ZEROFILL: 숫자의 자리 수가 고정된 경우 빈 자리에 0을 넣음
    * DEFAULT now(): 날짜 컬럼의 기본값을 현재 시간으로
## 3-5. Primary Key, Unique Index
* PRIMARY KEY(id)
    * id가 테이블에서 로우를 특정할 수 있게 해주는 고유한 값임을 의미
    * 학번, 주민등록번호같은 개념
* UNIQUE INDEX name_UNIQUE (name ASC)
    * 해당 컬럼(name)이 고유해야 함을 나타내는 옵션
    * name_UNIQUE는 이 옵션의 이름(아무거나 다른 걸로 지어도 됨)
    * ASC는 인덱스를 오름차순으로 저장함의 의미(내림차순은 DESC)

## 3-6. 테이블 옵션
* COMMENT: 테이블에 대한 보충 설명(필수 아님)
* DEFAULT CHARSET: utf8로 설정해야 한글이 입력됨(utf8mb4 하면 이모티콘 가능)
* ENGINE: InnoDB 사용(이외에 MyISAM이 있음, 엔진별로 기능 차이 존재)

## 3-7. 테이블 생성 확인
* DESC 테이블명
```
mysql> DESC users;
```
* 테이블 삭제하기 : DROP TABLE 테이블명
```
mysql> DROP TABLE users;
```

## 3-8. 댓글 테이블 저장하기
* comments 테이블 생성
```
mysql> CREATE TABLE nodejs.comments (
    id INT NOT NULL AUTO_INCREMENT,
    commenter INT NOT NULL,
    comment VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT now(),
    PRIMARY KEY(id),
    INDEX commenter_idx (commenter ASC),
    CONSTRAINT commenter
    FOREIGN KEY (commenter)
    REFERENCES nodejs.users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
    COMMENT = '댓글'
    DEFAULT CHARSET=utf8mb4
    ENGINE=InnoDB;
```

## 3-9. 외래키(foreign key)
* 댓글 테이블은 사용자 테이블과 관계가 있다.(사용자가 댓글을 달기 때문)
    * 외래키를 두어 두 테이블이 관계가 있다는 것을 표시
    * FOREIGN KEY (컬럼명) REFERENCES 데이터베이스.테이블명 (컬럼)
    * FOREIGN KEY (commenter) REFERENCES nodejs.users (id)
    * 댓글 테이블에는 commenter 컬럼이 생기고 사용자 테이블의 id값이 저장됨 

    * ON DELETE CASCADE, ON UPDATE CASCADE
    * 사용자 테이블의 로우가 지워지고 수정될 때 댓글 테이블의 연관된 로우들도 같이  지워지고 * 수정됨
    * 데이터를 일치시키기 위해 사용하는 옵션이다.(CASCADE 대신 SET NULL과 NO ACTION도 있음)
## 3-10. 테이블 목록 보기
* SHOW TALBES;
# 4. CRUD 작업하기
## 4-1. CRUD
* Create, Read, Update, Delete의 두문자어
    * 데이터베이스에서 가장 많이 하는 작업 4가지
## 4-2. Create
* INSERT INTO 테이블명 (컬럼명들) VALUES (값들)
## 4-3. Read
* SELECT 컬럼 FROM 테이블명
    * SELECT * 은 모든 컬럼을 선택한다는 의미
    * 컬럼만 따로 추리는 것도 가능하다.
## 4-4. Read 옵션들
* WHERE로 조건을 주어 선택 가능
    * AND로 여러가지 조건을 동시에 만족하는 것을 찾는다.
    * OR로 여러가지 조건 중 하나 이상을 만족하는 것을 찾는다.
## 4-5. 정렬해서 찾기
* ORDER BY로 특정 컬럼 값 순서대로 정렬 가능하다.
    * DESC는 내림차순, ASC는 오름차순
## 4-6. LIMIT, OFFSET
* LIMIT으로 조회할 개수를 제한한다.
* OFFSET으로 앞의 로우들 스킵 가능 (OFFSET 2면 세 번째 것부터 찾음)
## 4-7. Update
* 데이터베이스에 있는 데이터를 수정하는 작업
    * UPDATE 테이블명 SET 컬럼=새값 WHERE 조건
## 4-8. Delete
* 데이터베이스에 있는 데이터를 삭제하는 작업
    * DELETE FROM 테이블명 WHERE 조건

# 5. 시퀄라이즈 사용하기
* 시퀄라이즈는 알아서 id를 기본 키로 연결하기 때문에 id 컬럼은 적어줄 필요가 없다.
## 5-1. 시퀄라이즈 ORM
* SQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리이다.
    * ORM: Object Relational Mapping: 객체와 데이터를 매핑(1대1 짝지음)
    * MySQL 외에도 다른 RDB(Maria, Postgre, SQLite, MSSQL)와도 호환된다.
    * 자바스크립트 문법으로 데이터베이스 조작이 가능하다.
## 5-2. 시퀄라이즈 CLI 사용하기
* 시퀄라이즈 명령어를 사용하기 위해 sequelize-cli를 설치한다.  
    * mysql2는 MySQL DB가 아닌 드라이버이다.
* npx sequelize init으로 시퀄라이즈 구조를 생성한다.
## 5-3. models/index.js 수정
* 예제와 같이 수정한다.
    * require(../config/config) 설정 로딩
    * new Sequelize(옵션들..)로 DB와 연결이 가능하다.
## 5-4. MySQL 연결하기
* app.js 작성
    * sequelize.sync로 연결한다.
## 5-5. config.json 설정하기
* DB 연결 정보를 넣기
## 5-6. 연결 테스트하기
* npm start로 실행해서 SELECT 1+1 AS RESULT가 나오면 연결 성공
## 5-7. 모델 생성하기
* 테이블에 대응되는 시퀄라이즈 모델 생성
* 시퀄라이즈에서 모델이 Mysql에서는 테이블
* user.js 에서 User는 모델이름
* 시퀄라이즈는 아이디를 자동으로 생성해준다.
## 5-8. 모델 옵션들
* 시퀄라이즈 모델의 자료형은 MySQL의 자료형과 조금 다르다.
```
-----------------------------------------
        MySQL      |      시퀄라이즈
-----------------------------------------
    VARCHAR(100)   |      STRING(100)  
    INT            |      INTEGER
    TINYINT        |      BOOLEAN
    DATETIME       |      DATE
    INT UNSIGNED   |      INTEGER.UNSIGNED
    NOT NULL       |      allowNull: false
    UNIQUE         |      unique: true
    DEFAULT now()  |      defaultValue: Sequelize.NOW
```
* define 메서드의 세 번째 인자는 테이블 옵션이다.
    * timestamps: true면 createdAt(생성 시간), updatedAt(수정 시간) 컬럼을 자동으로 만듦
    * 예제에서는 직접 created_at 컬럼을 만들었으므로 false로 함
    * paranoid 옵션은 true면 deletedAt(삭제 시간) 컬럼을 만듦, 로우 복구를 위해 완전히 삭제하지 않고 deletedAt에 표시해둠
    * underscored 옵션은 캐멀케이스로 생성되는 컬럼을 스네이크케이스로 생성
    * modelName은 모델 이름, tableName 옵션은 테이블 이름을 설정
        * 시퀄라이즈는 기본적으로 테이블 이름을 모델 이름을 소문자및 복수형으로 만든 것을 사용한다. ex) 모델 이름: User ,테이블 이름: users
    * charset과 collate는 한글 설정을 위해 필요(이모티콘 넣으려면 utf8mb4로)
## 5-9. 댓글 모델 생성하기
* models 폴더에 comment.js 생성
## 5-10. 댓글 모델 활성화하기
* index.js에 모델 연결
    * init으로 sequelize와 연결
    * associate로 관계를 설정한다.
## 5-11. 관계 정의하기
* users 모델과 comments 모델 간의 관계를 정의
    * 1:N 관계 (사용자 한 명이 댓글 여러 개 작성)
    * 시퀄라이즈에서는 1:N 관계를 hasMany로 표현한다.(사용자.hasMany(댓글))
    * 반대의 입장에서는 belongsTo(댓글.belongsTo(사용자))
    * belongsTo가 있는 테이블에 컬럼이 생김(댓글 테이블에 commenter 컬럼)
```js
// user.js
static associate(db) {
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
    }
// comment.js
    static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
    }
```
## 5-12. 1대1 관계
* 1대1 관계
    * 예) 사용자 테이블과 사용자 세부정보 테이블
```js
db.User.hasone(db.Info, { foreignKey: 'UserId', sourceKey: 'id' });
db.Info.belongsTo(db.User, { foreignKey: 'UserId', targetKey: 'id' });
```

## 5-13. N대M 관계
* 다대다 관계
    * 예) 게시글과 헤시태그 테이블
    * 하나의 게시글이 여러 개의 해시태그를 가질 수 있고 하나의 해시태그가 여러 개의 게시글으르 가질 수 있다.
    * DB 특성상 다대다 관계는 중간 테이블이 생긴다.
```js
db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'});    // through는 중간 테이블 이름
db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});
```
## 5-14. 시퀄라이즈 쿼리 알아보기
* 윗 줄이 SQL문, 아랫 줄은 시퀄라이즈 쿼리(자바스크립트)
* User.create는 promise기 때문에 await이나 .then을 붙여야 결과값을 받을 수 있다.
```js
//  INSERT INTO nodejs.users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1');
const { User } = require('../models');
User.create({
    name: 'zero',
    age: 24,
    married: false,
    comment: '자기소개1',
});
// SELECT * FROM nodejs.users;
User.findALL({});
// SELECT name, married FROM nodejs.users;
User.findAll({
    attributes: ['name', 'married'],
});
```
* 특수한 기능들인 경우 Sequelize.Op의 연산자를 사용한다(gt, or 등)
    * gt: > , lt: < , gte: >= , lte: <=
```js
// SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
const { Op } = require('sequelize');
const { User } = require('../models');
User.findAll({
    attributes: ['name', 'age'],
    where: {
        married: true,
        age: { [Op.gt]: 30 },   // and
    },
});

// SELECT id, name FROM users WHERE married = 0 OR age > 30;
const { Op } = require('sequelize');
const { User } = require('../models');
User.findAll({
    attributes: ['id', 'name'],
    where: {
        [Op.or]: [{ married: false }, { age: { [Op.gt]: 30 } }],
    },
});

// SELCET id, name FROM users ORDER BY age DESC;
User.findAll({
    attributes: ['id', 'name'],
    // 오더는 기본적으로 2차원 배열이다.
    // order: [['age', 'DESC'], ['createdAt', 'asc']],
    // 첫번째인 age는 1순위 정렬, 두번째인 createdAt은 2순위 정렬이다.
    order: [['age', 'DESC']],
});

// SELCET id, name FROM users ORDER BY age DESC LIMIT 1;
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
    limit: 1,
});
// SELCET id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
    limit: 1,
    offset: 1,
});
// 수정 UPDATE
// UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
User.update({
    comment: '바꿀 내용',
}, {
    where: {id: 2},
});
// 삭제 DELETE
// DELETE FROM nodejs.users WHERE id = 2;
User.destory({
    where: {id: 2},
});
// 아이디가 1,3,5 인 사람을 지울때
User.destory({
    where: {id: { [Op.in]: [1,3,5] }},
});
```
## 5-15. 관계 쿼리
* 결괏값이 자바스크립트 객체이다.
```js
const user = await User.findOne({});
console.log(user.nick); // 사용자 닉네임
```
* include로 JOIN과 비슷한 기능이 수행 가능하다(관계 있는 것을 엮을 수 있다.)
```js
const user = await User.findOne({
    include: [{
        model: Comment,
    }]
});
console.log(user.Comments); // 사용자 댓글
``` 
* 다대다 모델은 다음과 같이 접근 가능
```js
db.sequelize.models.PostHashtag
```
* get+모델명으로 관계 있는 데이터 로딩 가능
```js
const user = await User.findOne({});
const comments = await user.getComments();
console.log(comments);  //  사용자 댓글
```
* as로 모델명 변경이 가능하다.
```js
// 관계를 설정할 때 as로 등록
db.User.hasMany(db.Comment, {foreignKey: 'commenter', sourceKey: 'id', as: 'Answers'});
// 쿼리할 때는
const user = await User.findOne({});
const comments = await user.getAnswers();
console.log(comments);  // 사용자 댓글
```
* include나 관계 쿼리 메서드에도 where나 attributes
```js
const user = await User.findOne({
    include: [{
        model: Comment,
        where: {
            id: 1,
        },
        attributes: ['id'],
    }]
});
// 또는
const comments = await user.getComments({
    where:{
        id: 1,
    }
    attributes: ['id'],
});
```
* 생성 쿼리
```js
const user = await User.findOne({});
const comment = await Comment.create();
await user.addComment(comment);
// 또는
await user.addComment(comment.id);
```
* 여러 개를 추가할 때는 배열로 추가가 가능하다.
```js
const user = await User.findOne({});
const comment1 = await Comment.create();
const comment2 = await Comment.create();
await user.addComment([cocmment1, comment2]);
```
* 수정은 set+모델명, 삭제는 remove+모델명
## 5-16. 관계 쿼리
* 직접 SQL을 쓸 수 있음
```js
const [result, metadata] = await sequelize.query('SELECT * from comments');
console.log(result);
```
## 5-17. 쿼리 수행하기
* <https://github.com/zerocho/nodejs-book/tree/master/ch7/7.6/learn-sequelize> 프런트 코드 복사
* 프런트 코드보다는 서버 코드 위주로 보기
    * 프런트 코드는 서버에 요청을 보내는 AJAX 요청 위주로만 파악
* users 라우터
    * 예제 참조
    * get, post, delete, patch 같은 요청에 대한 라우터 연결
    * 데이터는 JSON 형식으로 응답
    * comments 라우터도 마찬가지
* comments 라우터
    * 예제 참조
    
## 5-18. 서버 접속하기
* npm start로 서버 시작
    * localhost:3001 로 접속하면 시퀄라이즈가 수행하는 SQL문이 콘솔에 찍힌다.
* 이후 글 등록/수정/삭제 해보기

## 5-19. 시퀄라이즈 참조
* 시퀄라이즈 공식 문서
* <https://sequelize.org/master/>















