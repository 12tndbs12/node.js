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
# 2. 서버센트 이벤트 사용하기
## 2-1. 서버센트 이벤트 사용
* 경매는 시간이 생명
	* 모든 사람이 같은 시간에 경매가 종료되어야 함
	* 모든 사람에게 같은 시간이 표시되어야 함
	* 클라이언트 시간은 믿을 수 없음(조작 가능)
	* 따라서 서버 시간을 주기적으로 클라이언트로 내려보내줌
	* 이 때 서버에서 클라이언트로 단방향 통신을 하기 때문에 서버센트 이벤트(Server Sent Events, SSE)가 적합
	* 웹 소켓은 실시간으로 입찰할 때 사용
```
// console
npm i sse socket.io
```
## 2-2. 서버에 서버센트 이벤트 연결
* app.js에 SSE(sse.js 작성 후) 연결
	* sse.on(‘connection’)은 서버와 연결되었을 때 호출되는 이벤트
	* client.send로 클라이언트에 데이터 전송 가능(책에서는 서버 시각 전송)
```js
// sse.js
const SSE = require('sse');
module.exports = (server) => {
    const sse = new SSE(server);
    sse.on('connection', (client) => {  // 서버센트 이벤트 연결
	// 클라이언트로 시간을 보내줌.
	// sse는 문자열만 보내줄 수 있기 때문에 .toString으로 문자열로 보내줌 
        setInterval(() => {
            client.send(Date.now().toString());
        }, 1000);
    });
};
// app.js
...
const passportConfig = require('./passport');
const sse = require('./sse');
const webSocket = require('./socket');

const app = express();
...
const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});

webSocket(server, app);
sse(server);
```
## 2-3. 웹 소켓 코드 작성하기
* socket.js 작성하기
	* 경매 방이 있기 때문에 11장에서 방에 들어가는 코드 재사용
	* referer에서 방 아이디를 추출해서 socket.join
	* roomId는 Good 테이블의 로우 id가 된다.
```js
const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server, {path: '/socket.io'});
    app.set('io', io);
    io.on('connection', (socket) => {   // 웹 소켓 연결 시
        const req = socket.request;
        const {headers: { referer }} = req;
        const roomId = referer.split('/')[referer.split('/').length-1];
        socket.join(roomId);
        socket.on('disconnect', () => {
            socket.leave(roomId);
        });
    });
};
```

## 2-4. EventSource polyfill
* SSE는 EventSource라는 객체로 사용
	* IE에서는 EventSource가 지원되지 않음
	* EventSource polyfill을 넣어줌(첫 번째 스크립트)
	* new EventSource(‘/sse’)로 서버와 연결
	* es.onmessage로 서버에서 내려오는 데이터 받음(e.data에 들어있음)
	* main.html 맨 아래 부분에 코드 추가
	* 아랫부분은 서버 시간과 경매 종료

```html
<!-- IE에서도 작동하게 하는 코드 -->
<script src="https://unpkg.com/event-source-polyfill/src/eventsource.min.js"></script>
<!-- sse -->
<script>
const es = new EventSource('/sse');
es.onmessage = function (e) {
    document.querySelectorAll('.time').forEach((td) => {
        const end = new Date(td.dataset.start); // 경매 시작 시간
        const server = new Date(parseInt(e.data, 10));
        end.setDate(end.getDate() + 1); // 경매 종료 시간
        if (server >= end) { // 경매가 종료되었으면
        return td.textContent = '00:00:00';
    } else {
        const t = end - server; // 경매 종료까지 남은 시간
        const seconds = ('0' + Math.floor((t / 1000) % 60)).slice(-2);
        const minutes = ('0' + Math.floor((t / 1000 / 60) % 60)).slice(-2);
        const hours = ('0' + Math.floor((t / (1000 * 60 * 60)) % 24)).slice(-2);
        return td.textContent = hours + ':' + minutes + ':' + seconds ;
    }
    });
};
</script>
```
## 2-5. EventSource 확인해보기
* 개발자 도구 Network 탭을 확인
	* GET /sse가 서버센트 이벤트 접속한 요청(type이 eventsource)
	* GET /sse 클릭 후 EventStream 탭을 보면 매 초마다 서버로부터 타임스탬프 데이터가 오는 것을 확인 가능
## 2-6. 클라이언트에 웹소켓, SSE 연결하기
* auction.html에 서버 시간과 실시간 입찰 기능 추가
	* 소스 코드는 https://github.com/ZeroCho/nodejs-book/blob/master/ch13/13.2/node-auction/views/auction.html 
	* 서버 시간을 받아와서 카운트다운하는 부분은 이전과 동일
	* 세 번째 스크립트 태그는 입찰 시 POST /good/:id/bid로 요청을 보내는 것
	* 다른 사람이 입찰했을 때 Socket.IO로 입찰 정보를 렌더링함
## 2-7. 상품정보, 입찰 라우터 작성하기
* GET /good/:id와 POST /good/:id/bid 추가
* GET /good/:id
	* 해당 상품과 기존 입찰 정보들을 불러온 뒤 렌더링
	* 상품 모델에 사용자 모델을 include할 때 as 속성 사용함(owner과 sold 중 어떤 관계를 사용할지 밝혀주는 것)
* POST /good/:id/bid
	* 클라이언트로부터 받은 입찰 정보 저장
	* 시작 가격보다 낮게 입찰했거나, 경매 종료 시간이 지났거나, 이전 입찰가보다 낮은 입찰가가 들어왔다면 반려
	* 정상 입찰가가 들어 왔다면 저장 후 해당 경매방의 모든 사람에게 입찰자, 입찰 가격, 입찰 메시지 등을 웹 소켓으로 전달
	* Good.find 메서드의 order 속성은 include될 모델의 컬럼을 정렬하는 방법(Auction 모델의 bid를 내림차순으로 정렬)
```js
// routes/index.js
router.get('/good/:id', isLoggedIn, async (req, res, next) => {
    try {
        const [ good, auction ] = await Promise.all([
            Good.findOne({
                where: { id: req.params.id },
                include: {
                    model: User,
                    as: 'Owner',
                },
            }),
            Auction.findAll({
                where: { GoodId: req.params.id },
                include: { model: User },
                order: [['bid', 'ASC']],
            }),
        ]);
        res.render('auction', {
            title: `${good.name} - NodeAuction`,
            good,
            auction,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/good/:id/bid', isLoggedIn, async (req, res, next) => {
    try {
        const { big, msg } = req.body;
        const good = await Good.findOne({
            where: { id: req.params.id };
            include: { model: Auction },
            order: [[{ model: Auction}, 'bid', 'DESC']],
        });
        if (good.price >= bid) {
            return res.status(403).send('시작 가격보다 높게 입찰해야 합니다.');
        }
        if (new Date(good.createdAt).valueOf() + (24 * 60 * 60 * 1000) < new Date()) {
            return res.status(403).send('경매가 이미 종료되었습니다');
        }
        if (good.Auctions[0] && good.Auctions[0].bid >= bid) {
            return res.status(403).send('이전 입찰가보다 높아야 합니다');
        }
        const result = await Auction.create({
            bid,
            msg,
            UserId: req.user.id,
            GoodId: req.params.id,
        });
        // 실시간으로 입찰내역 전송
        req.app.get('io').to(req.params.id).emit('bid', {
            bid: result.bid,
            msg: result.msg,
            nick: req.user.nick,
        });
        return res.send('OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
})

module.exports = router;
```
## 2-8. 경매 진행해보기
* 서버 연결 후 경매 시작
	* 브라우저를 두 개 띄워 각자 다른 아이디로 로그인하면 두 개의 클라이언트가 동시 접속한 효과를 얻을 수 있음

# 3. 스케줄링 구현하기
## 3-1. 스케줄러 설치하기
* 경매가 생성된 지 24시간 후에 낙찰자를 정함
	* 24시간 후에 낙찰자를 정하는 시스템 구현해야 함
	* node-schedule 모듈 사용
```console
npm i node-schedule
```
## 3-2. 스케줄링용 라우터 추가하기
* routes/index.js에 추가
	* schedule 모듈을 불러옴
	* scheduleJob 메서드로 일정 예약
	* 첫 번째 인수로 실행될 시각을 넣고, 두 번째 인수로 콜백 함수를 넣음
	* 가장 높은 입찰을 한 사람을 찾아 상품 모델의 낙찰자 아이디에 넣어줌
	* 동시에, 낙찰자의 보유 자산을 낙찰 금액만큼 제외(sequelize.literal(컬럼 – 숫자)로 숫자 줄임)
	* 단점: 노드 기반으로 스케쥴링이 되므로, 노드가 종료되면 스케줄 예약도 같이 종료됨
	* 서버가 어떤 에러로 종료될 지 예측하기 어려우므로 보완하기 위한 방법이 필요함
```js
// routes/index.js
...
const fs = require('fs');
const Schedule = require('node-schedule');

const { Good, Auction, User } = require('../models');
...
router.post('/good', isLoggedIn, upload.single('img'), async (req, res, next) => {
    try {
        const { name, price } = req.body;
        const good = await Good.create({
            OwnerId: req.user.id,
            name,
            img: req.file.filename,
            price,
        });
        const end = new Date();
        end.setDate(end.getDate() + 1)  //하루 뒤
        schedule.scheduleJob(end, async () => {
            // 트랙잭션 : 같이 묶여서 같이 성공하거나 같이 실패한다.
            const t = await sequelize.transaction();
            try {
                const success = await Auction.findOne({
                    where: { GoodId: good.id },
                    oreder: [['bid', 'DESC']],
                    transaction: t,
                });
                await Good.update({ SoldId: success.UserId }, { where: { id: good.id}, transaction: t });
                // UPDATE Users SET money = money - 14000 where id = 1;
                await User.update({
                    money: sequelize.literal(`money - ${success.bid}`),
                }, {
                    where: { id: success.UserId },
                    transaction: t,
                });
                await t.commit();
            } catch (error) {
                await t.rollback();
            }
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
...
```
## 3-3. 서버 시작 시 이전 경매 체크하기
* 서버가 시작될 때 경매 후 24시간이 지났지만 낙찰자가 없는 경매를 찾아 낙찰자 지정
	* checkAuction.js 작성 후 app.js에 연결
```js
// app.js
const webSocket = require('./socket');
// 추가
const checkAuction = require('./checkAuction');

const app = express();
passportConfig();
// 추가
checkAuction();
```
```js
// checkAuction.js
const { Op } = require('Sequelize');
const schedule = require('node-schedule');
const { Good, Auction, User, sequelize } = require('./models');

module.exports = async () => {
    console.log('checkAuction');
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() -1); // 어제 시간
        const targets = await Good.findAll({
            where: {
                SoldId: null,
                createdAt: {[Op.lte]: yesterday},
            },
        });
        targets.forEach(async (target) => {
            const success = await Auction.findOne({
                where: { GoodId: target.id },
                order: [['bid', 'DESC']],
            });
            await Good.update({ SoldId: success.UserId }, { where: { id: target.id } });
            await User.update({
                money: sequelize.literal(`money - ${success.bid}`),
            }, {
                where: { id: success.UserId },
            });
        });
        const unsold = await Good.findAll({
            where: {
                SoldId: null,
                createdAt: {[Op.gt]: yesterday},
            },
        });
        unsold.forEach( (target) => {
            const end = new Date(unsold.createdAt);
            end.setDate(end.getDate() + 1)  //하루 뒤
            schedule.scheduleJob(end, async () => {
                const success = await Auction.findOne({
                    where: { GoodId: target.id },
                    order: [['bid', 'DESC']],
                });
                await Good.update({ SoldId: success.UserId }, { where: { id: target.id } });
                await User.update({
                    money: sequelize.literal(`money - ${success.bid}`),
                }, {
                    where: { id: success.UserId },
                });
            });
        });
    } catch (error) {
        console.error(error);
    }
}; 
```
## 3-4. 서버 시작 시 이전 경매 체크하기
* 24시간을 기다리면 낙찰됨
	* 서버가 계속 켜져 있어야 함
	* 빠른 테스트를 위해 시간을 단축해서 해보기
# 4. 프로젝트 마무리하기
## 4-1. 낙찰 내역 보기 구현하기
* GET /list 라우터 작성 후 views/list.html 작성 및 views/layout.html 수정
```js
// routes/index.js
...
router.get('/list', isLoggedIn, async (req, res, next) => {
    try {
        const goods = await Good.findAll({
            where: { SoldId: req.user.id },
            include: { model: Auction },
            order: [[{ model: Auction }, 'bid', 'DESC']],
        });
        res.render('list', { title: '낙찰 목록 - NodeAuction', goods});
    } catch (error) {
        console.error(error);
        next(error);
    }
});
module.exports = router;
```
## 4-2. 낙찰 내역 보기
* 낙찰자의 계정으로 로그인 후 http://localhost:8010/list에서 낙찰 목록 확인
## 4-3. 운영체제의 스케줄러
* node-schedule로 등록한 스케줄은 노드 서버가 종료될 때 같이 종료됨
	* 운영체제의 스케줄러를 사용하는 것이 좋음
	* 윈도에서는 schtasks
	* 맥과 리눅스에서는 cron 추천
	* 노드에서는 이 두 명령어를 child_process를 통해 호출할 수 있음

# 스스로 해보기
* 상품 등록자는 참여할 수 없게 만들기(라우터에서 검사)
* 경매 시간을 자유롭게 조정할 수 있도록 만들기(상품 등록 시 생성할 수 있게 화면과 DB 수정)
* 노드 서버가 꺼졌다 다시 켜졌을 때 스케줄러 다시 생성하기(checkAuction에서 DB 조회 후 스케줄러 설정)
* 아무도 입찰하지 않아 낙찰자가 없을 때를 대비한 처리 로직 구현하기(checkAuction과 스케줄러 수정)

# 핵심정리
* 서버에서 클라이언트로 보내는 일방향 통신은 웹 소켓 대신 서버센트 이벤트를 사용해도 된다.
* 기존 입찰 내역은 데이터베이스에서 불러오고, 방 참여 후에 추가되는 내역은 웹 소켓에서 불러온다. 이 둘을 매끄럽게 연결하는 방법을 기억하자.
* 코드가 길어질 것 같으면 app.js로부터 socket.js와 checkAuction.js처럼 분리한다.
* 사용자의 입력값은 프런트엔드와 백엔드 모두에서 체크하는 게 좋다.
* 스케줄링을 통해 주기적으로 일어나는 작업을 처리할 수 있지만, 노드 서버가 계속 켜져 있어야만 하므로 노드 서버가 꺼졌을 때 대처할 방법을 마련해야 한다.



