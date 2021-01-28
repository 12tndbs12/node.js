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
