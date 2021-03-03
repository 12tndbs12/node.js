웹 소켓 이해하기
================
# 1. 웹 소켓 이해하기
## 1-1. 웹 소켓 이해하기
* 웹 소켓: 실시간 양방향 데이터 전송을 위한 기술
    * ws 프로토콜 사용 -> 브라우저가 지원해야 한다.
    * 최신 브라우저는 대부분 웹 소켓을 지원한다.
    * 노드는 ws나 Socket.IO 같은 패키지를 통해 웹 소켓 사용이 가능하다..
* 웹 소켓 이전에는 폴링이라는 방식을 사용했다.
    * HTTP가 클라이언트에서 서버로만 요청이 가기 때문에 주기적으로 서버에 요청을 보내 업데이트가 있는지 확인한다.
    * 웹 소켓은 연결도 한 번만 맺으면 되고, HTTP와 포트 공유도 가능하며, 성능도 매우 좋다.

## 1-2. 서버센트 이벤트
* SSE(Server Sent Events)
    * EventSource라는 객체를 사용
    * 처음에 한 번만 연결하면 서버가 클라이언트에 지속적으로 데이터를 보내줌
    * 클라이언트에서 서버로는 데이터를 보낼 수 없음

# 2. ws 모듈로 웹 소켓 사용하기
## 2-1. gif-chat 프로젝트 생성
* gif-chat 폴더 생성 후 package.json 작성
```js
{
  "name": "gif-chat",
  "version": "1.0.0",
  "description": "GIF 웹소켓 채팅방",
  "main": "app.js",
  "scripts": {
    "start": "nodemon app"
  },
  "author": "rkdden",
  "license": "MIT",
  "dependencies": {
    "cookie-parser": "^1.4.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "express-session": "^1.17.1",
    "morgan": "^1.10.0",
    "nunjucks": "^3.2.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}
```
* 패키지 설치 후 .env와 app.js routes/index.js 파일 작성
    * 소스 코드는 https://github.com/ZeroCho/nodejs-book/tree/master/ch12/12.2/gif-chat
## 2-2. ws 모듈 설치하기
* npm i ws로 설치
    * 웹 소켓을 익스프레스에 연결하기
```js
//app.js
...
const webSocket = require('./socket');
...
const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});

webSocket(server);
```
## 2-3. socket.js 파일
* ws 모듈을 불러옴
    * new Websocket.Server({ server }) 로 익스프레스 서버와 연결
    * connection 이벤트는 서버와 연결될 때 실행되는 이벤트
    * req.headers[‘x-forwarded-for’] || req.connection.remoteAddress는 클라이언트의 IP를 알아내는 유명한 방법
    * message, error, close 이벤트는 각각 메시지가 올 때, 에러 발생할 때, 서버 연결 종료할 때 호출
    * ws.OPEN은 연결 상태가 열려있다는 뜻(연결되었다는 뜻)
    * ws.send로 메시지 전송(3초마다 보내고 있음)
```js
const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    // 웹 소켓 연결 시
    wss.on('connection', (ws, req) => {
        // ip 파악
        // req.socket.remoteAddress;
        const ip = req.headers['x-forwared-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속', ip);
        // 클라이언트에서 서버로 메세지를 send 했을 때
        ws.on('message', (message) => {
            console.log(message);
        });
        // 에러시
        ws.on('error', (error) => {
            console.error(error);
        });
        // 연결 종료시
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval);
        });
        // 3초마다 클라이언트로 메세지 전송
        ws.interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메세지를 보냅니다.');
            }
        }, 3000);
    });
};
```

## 2-4. 프런트엔드에서 메시지 답장하기
* index.html를 작성하고 스크립트 작성
  * new WebSocket은 최신 브라우저에서 지원
  * 인수로 서버의 주소를 입력
  * onopen 이벤트리스너는 서버와 연결되었을 때 호출
  * onmessage 이벤트리스너는 서버에서 메시지가 올 때 호출
  * event.data에 서버 메시지 내용이 들어 있음
  * webSocket.send로 서버로 메시지 전달 가능
```html
<!-- views/index.html -->
...
    <div>F12를 눌러 console 탭과 network 탭을 확인하세요.</div>
    <script>
        // WebSocket이라는 객체는 브라우저에서 제공한다.
        // ws는 포트 공유 가능
        const webSocket = new WebSocket("ws://localhost:8005");
        // 서버랑 연결되는 순간 실행됨
        webSocket.onopen = function () {
            console.log('서버와 웹소켓 연결 성공!');
        };
        // 서버에서 메세지가 오는 순간 실행됨
        webSocket.onmessage = function (event) {
            console.log(event.data);
            webSocket.send('클라이언트에서 서버로 답장을 보냅니다');
        };
    </script>
...

```

## 2-5. 서버 실행하기
* http://localhost:8005 접속
  * F12 console 탭 실행
  * 접속하는 순간부터 노드의 콘솔과 브라우저의 콘솔에 3초마다 메시지 찍힘
## 2-6. Network 요청 확인하기
* 개발자 도구의 Network 탭 열기
  * localhost Type:websocket 클릭 후 Messages 탭 클릭
  * websocket 요청 한 번으로 지속적으로 데이터 주고 받음

## 2-7. 다른 브라우저로도 연결하기
* 다른 브라우저에서 http://localhost:8005에 접속
    * 접속한 브라우저(클라이언트)가 두 개라, 서버가 받는 메시지의 양도 두 배가 됨
    * 크롬에서도 시크릿 페이지와 일반 페이지 두개로 가능
## 2-8. 클라이언트 하나 종료하기
* 브라우저를 하나 종료하기
  * 콘솔에 접속 해제 메시지가 뜨고, 메시지의 양이 하나가 됨
  * 편의성을 위해 ws 모듈 대신 Socket.IO 모듈 사용

# 3. Socket.IO 사용하기
## 3-1. Socket.IO 설치하기
* npm i socket.io
    * 채팅방에 적합
        * 채팅방이 아닌 다른 서비스에는 맞지 않는 경우도 있음, ws에서 직접 구현
    * ws 패키지 대신 Socket.IO 연결
    * Socket.IO 패키지를 불러와 익스프레스 서버와 연결. 두 번째 인수는 클라이언트와 연결할 수 있는 경로(/socket.io)
    * connection 이벤트는 서버와 연결되었을 때 호출, 콜백으로 소켓 객체(socket) 제공
    * socket.request로 요청 객체에 접근 가능, socket.id로 소켓 고유 아이디 확인 가능
    * disconnect 이벤트는 연결 종료 시 호출, error는 에러 발생 시 호출
    * reply는 사용자가 직접 만들 이벤트로 클라이언트에서 reply 이벤트 발생 시 서버에 전달됨
    * socket.emit으로 메시지 전달. 첫 번째 인수는 이벤트 명, 두 번째 인수가 메시지
```js
// socket.js
const SocketIO = require('socket.io');

module.exports = (server) => {
    const io = SocketIO(server, {path: '/socket.io'});

    // 웹 소켓 연결 시
    io.on('connection', (socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwared-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
        // 연결 종료 시
        socket.on('disconnect', () => { 
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });
        // 에러시
        socket.on('error', (error) => {
            console.error(error);
        });
        // 클라이언트로부터 메세지 수신 시
        socket.on('reply', (data) => {
            console.log(data);
        });
        // 3초마다 클라이언트로 메세지 전송
        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO');
        }, 3000);
    });
};
```
## 3-2. 클라이언트에서 메시지 주고 받기
* index.html 수정
    * /socket.io/socket.io.js 스크립트를 넣어주어야 함(io 객체 제공)
    * connect 메서드로 서버 주소로 연결하고 서버의 설정과 같은 path 입력(/socket.io)
    * 서버 주소가 http 프로토콜임에 유의
    * news 이벤트 리스너로 서버에서 오는 news 이벤트 대기
    * socket.emit(‘reply’, 메시지)로 reply 이벤트 발생
```js
...
<div>F12를 눌러 console 탭과 network 탭을 확인하세요.</div>
<script src="/socket.io/socket.io.js"></script>
<script>
    // 아래 path는 socket.js의 path와 일치시켜야한다.
    const socket = io.connect('http://localhost:8005', {
        path: '/socket.io',
        transports: ['websocket'],
    });
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('reply', 'Hello Node.JS');
    });
</script>
...
```
## 3-3. 서버 실행하기
* http://localhost:8005에 접속
    * 개발자 도구 Network 탭을 보면 웹소켓과 폴링 연결 둘 다 있음 확인 가능
    *  Socket.IO는 먼저 폴링 방식으로 연결 후(웹 소켓을 지원하지 않는 브라우저를 위해), 웹 소켓을 사용할 수 있다면 웹 소켓으로 업그레이드
    * 웹 소켓만 사용하고 싶다면 transports 옵션을 다음과 같이 주면 됨
```js
...
const socket = io.connect('http://localhost:8005', {
            path: '/socket.io',
            // 처음부터 웹소켓으로 시도
            transports: ['websocket'],
        });
...
```
# 4.실시간 GIF 채팅방 만들기
## 4-1. 프로젝트 구조 갖추기
* 필요 패키지 설치 후 스키마 작성
    * color-hash는 익명 닉네임에 컬러를 줄 때 사용
```
npm i mongoose multer axios color-hash
```
## 4-2. 스키마 생성하기
* 채팅방 스키마(room.js)와 채팅 스키마(chat.js) 작성
```js
// schemas/room.js
const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
    // 방 제목
    title: {
        type: string,
        required: true,
    },
    // 방 인원 최대 10명, 최소 2명
    max: {
        type: Number,
        required: true,
        default:10,
        min: 2,
    },
    // 방장
    owner: {
        type: String,
        required: true,
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Room', roomSchema);
```
```js
// schema/chat.js
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: {ObjectId} } = Schema;
const chatSchma = new Schema({
    // 방에 대한 오브젝트
    room: {
        type: ObjectId,
        required: true,
        ref: 'Room',
    },
    user: {
        type: String,
        required: true,
    },
    chat: String,
    gif: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exprots = mongoose.model('chat', chatSchma);
```

## 4-3. 스키마 연결하기
* 스키마를 index.js와 연결
    * 익스프레스와 몽구스를 연결
    * .env 파일에 비밀키 입력
```js
// .env
COOKIE_SECRET=gifchat
MONGO_ID=root
MONGO_PASSWORD=nodejsbook
```
```js
// schemas/index.js
const mongoose = require('mongoose');
// .env에 들어있는 MONGO_ID, MONGO_PASSWORD, NODE_ENV를 가져온다
const {MONGO_ID, MONGO_PASSWORD, NODE_ENV} = process.env;
// 몽고디비 로그인
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;
const connect = () => {
    // 개발모드일때는 쿼리 기록
    if (NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    // 몽구스 연결
    mongoose.connect(MONGO_URL, {
        dbName: 'gifchat',
        useNewUrlParser: true,
        useCreateIndex: true,
    }, (error) => {
        if (error) {
            console.log('몽고디비 연결 에러', error);
        }else{
            console.log('몽고디비 연결 성공');
        }
    });
};

mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
});

module.exports = connect;
```
```js
// app.js
...
const indexRouter = require('./routes');
// 추가
const connect = require('./schemas');

const app = express();
app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
// 추가
connect();
```

## 4-4. 프런트엔드 파일 작성
* https://github.com/ZeroCho/nodejs-book/tree/master/ch12/12.4/gif-chat
    * views/layout.html, public/main.css, views/main.html, views/room.html, views/chat.html 작성
    * main.html의 코드에서 io.connect의 주소가 달라졌다는 점에 주목
    * 주소의 /room은 네임스페이스(같은 네임스페이스끼리만 데이터 전달 가능)
    * socket에는 newRoom(새 방 생성 시 목록에 방 추가 이벤트)과 removeRoom(방 폭파 시 목록에서 방 제거 이벤트) 이벤트 연결
    * chat.html에서는 /chat 네임스페이스에 연결
    * join 이벤트(방에 참가할 때 들어왔다는 시스템 메시지 등록)와 exit 이벤트(방에서 나갈 때 나갔다는 시스템 메시지 등록) 연결
    * 프론트쪽 코드는 안봐도 되며, socket.on 부분만 보자
    * routes/index.js에서 res.render('main');으로 변경

## 4-5. socket.js에 소켓 이벤트 연결
* socket.js 수정
    * app.set(‘io’, io);로 라우터에서 io 객체를 쓸 수 있게 저장(req.app.get(‘io’)로 접근 가능)
    *  io.of는 네임스페이스에 접근하는 메서드
    * 각각의 네임스페이스에 이벤트를 따로 걸어줄 수 있음
    * req.headers.referer에 요청 주소가 들어 있음
    * 요청 주소에서 방 아이디를 추출하여 socket.join으로 방 입장
    * socket.leave로 방에서 나갈 수 있음
    * socket.join과 leave는 Socket.IO에서 준비해둔 메서드
```js
// socket.js
const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server, {path: '/socket.io'});
    // 라우터에서 소켓io의 객체 사용
    // req.app.get('io');
    app.set('io',io);
    // 네임스페이스
    const room = io.of('/room');
    const chat = io.of('/chat');

    // 네임스페이스별로 각각 커넥션 생성
    room.on('connection', (socket) => {
        console.log('room 네임스페이스에 접속');
        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });

    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
        const req = socket.request;
        const { headers: { referer }} = req;
        // 주소에서 roomId를 추출하는 부분
        const roomId = referer
            .split('/')[referer.split('/').length -1]
            .replace(/\?.+/, '');
        socket.join(roomId);
    })
    
    // 연결 종료 시
    socket.on('disconnect', () => { 
        console.log('chat 네임스페이스 접속 해제');
        socket.leave(roomId);
    });
};
```
## 4-6. 방 개념 이해하기
* Socket.IO에서는 io 객체 아래에 네임스페이스와 방이 있음
    * 기본 네임스페이스는 /
    * 방은 네임스페이스의 하위 개념
    * 같은 네임스페이스, 같은 방 안에서만 소통할 수 있음
```
Socket.IO       네임스페이스    방
            ┌   /room
    io  -   ┤
            └   /chat       ┬  방 아이디
                            ├  방 아이디
                            ├  방 아이디
                            └  방 아이디
```                 
## 4-7. color-hash 적용하기
* 익명 채팅이므로 방문자에게 고유 컬러 아이디 부여
    * 세션에 컬러 아이디 저장(req.session.color)
```js
// app.js
...
const dotenv = require('dotenv');
const ColorHash = require('color-hash');
...
app. use((req, res, next) => {
    if (!req.session.color) {
        const colorHash = new ColorHash();
        req.session.color = colorHash.hex(req.sessionID);
    }
    next();
});

app.use('/', indexRouter);
...
// 서버에 담은후
const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
// 소켓과 연결
webSocket(server, app);
```
## 먼저 테스트
* 라우터 만들기
    * routes/index.js 수정
```js
const express = require('express');

// 스키마 가져오기
const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        // 모든 방을 찾아서
        const rooms = await Room.find({});
        // main에 render
        res.render('main', { rooms, title: 'GIF 채팅방' });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/room', (req, res) => {
    res.render('room', { title: 'GIF 채팅방 생성'});
});

router.post('/room', async (req, res, next) => {
    try {
        // 방 생성
        const newRoom = await Room.create({
            title: req.body.title,
            max: req.body.max,
            // 방장은 색깔로 구별
            owner: req.session.color,
            password: req.body.password,
        });
        // socket.js 에서
        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);
        // 방 생성후 입장
        res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/room/:id', async (req, res, next) => {
    try {

        const room = await Room.findOne({ _id: req.params.id });
        const io = req.app.get('io');
        if (!room) {
            return res.redirect('/?error=존재하지 않는 방입니다.');
        }
        if (room.password && room.password !== req.query.password) {
            return res.redirect('/?error=비밀번호가 틀렸습니다.');
        }
        // io.of('/chat').adapter.rooms 안에 방 목록들이 들어있다.
        const { rooms } = io.of('/chat').adapter;
        // 인원제한
        // rooms[req.params.id]는 방 안의 사용자들
        // rooms[req.params.id].length 방 안의 사용자가 몇 명인지 확인
        if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
            return res.redirect('/?error=허용 인원이 초과하였습니다.');
        }
        return res.render('chat', {
            room,
            title: room.title,
            chats: [],
            user: req.session.color,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});
// 모든 사용작가 채팅방을 나갔을때 2초뒤 폭파
router.delete('/room/:id', async (req, res, next) => {
    try {
        // 방 삭제
        await Room.remove({ _id: req.params.id });
        // 채팅 내용 삭제
        await Chat.remove({ room: req.params.id });
        res.send('ok');
        // 먼저 보내서 방 목록 보고 있는 사람들에게서 지우고
        req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        // 마지막으로 방 나간 사람에게는 방이 지워지게
        setTimeout(() => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        }, 2000);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
```

# 5. 미들웨어와 소켓 연결하기
## 5-1. socket.io에서 세션 사용하기
* app.js 수정 후 Socket.IO 미들웨어로 연결
    * io.use로 익스프레스 미들웨어를 Socket.io에서 사용 가능
```js
nunjucks.configure('views', {
    express: app,
    watch: true,
});
// app.js
...
connect();

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
});
...
// 소켓과 연결
webSocket(server, app, sessionMiddleware);
```
```js
// socket.js
const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, {path: '/socket.io'});
    app.set('io',io);
    // 네임스페이스
    const room = io.of('/room');
    const chat = io.of('/chat');
    // socket.request에 적용
    // socket.request에 쿠키와 세션 생성
    io.use((socket, next) => {
        cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
        sessionMiddleware(socket.request, socket.request.res, next);
    });
...
```

## 5-2. 방 입장, 퇴장 메시지 전송하기
* to(방아이디).emit(이벤트, 메시지)로 특정 방에 데이터 전송
    * 사용자가 0명이면 방 폭파 기능도 추가
    * socket.adapter.rooms[방아이디]에 방에 들어있는 소켓 아이디 목록이 나옴
    * .length로 방 인원 파악 가능(정확하지는 않음)
    * 방 폭파 기능은 익스프레스 라우터로 따로 구현
    * axios로 라우터에 요청을 보냄
    * 따로 구현하는 이유는 DB 작업을 라우터에서 처리하는 게 편하기 때문
```js
// socket.js
chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
        const req = socket.request;
        const { headers: { referer }} = req;
        // console.log(req);
        // 주소에서 roomId를 추출하는 부분
        const roomId = referer
            .split('/')[referer.split('/').length -1]
            .replace(/\?.+/, '');
        socket.join(roomId);
        socket.to(roomId).emit('join', {
            user: 'system',
            chat: `${req.session.color}님이 입장하셨습니다.`
        });
        // 연결 종료 시
        socket.on('disconnect', () => { 
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);
            const currentRoom = socket.adapter.rooms[roomId];
            const userCount = currentRoom ? currentRoom.length : 0;
            if (userCount === 0) {  // 유저가 0명이면 방 삭제
                axios.delete(`http://localhost:8005/room/${roomId}`)
                    .then(() => {
                        console.log('방 제거 요청 성공');
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            } else {
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하셨습니다.`,
                })
            }
        });
    })
```
## 5-3. 라우터 작성하기
* 소스 코드는 https://github.com/ZeroCho/nodejs-book/tree/master/ch12/12.6/gif-chat
    * routes/index.js 작성
    * GET /: 메인 페이지(방 목록) 접속 라우터
    * GET /room: 방 생성 화면 라우터
    * POST /room: 방 생성 요청 라우터
    * GET  /room/:id 방 입장 라우터
    * DELETE /room/:id 방 제거 라우터
    * req.app.get(‘io’)로 io 객체 불러옴
    * io.of(네임스페이스).adapter[방아이디]로 방에 들어있는 소켓 내역을 확인할 수 있음
    * .length로 방 인원 확인 가능
    * 방 최대 인원보다 작은 경우에 접속 가능함
## 5-4. 방 생성하기
* 몽고디비와 서버 모두 실행
    * 브라우저 두 개를 띄워 http://localhost:8005에 접속
    * 두 명이 접속한 것과 같은 효과
    * 방을 생성해보기
# 6. 채팅 구현하기
## 6-1. 채팅 소켓 이벤트 리스너 붙이기
* https://github.com/ZeroCho/nodejs-book/blob/master/ch12/12.6/gif-chat/views/chat.html 수정
    * chat 이벤트 리스너를 추가함. 채팅 메시지가 웹 소켓으로 전송될 때 호출됨
    * event.data.user(채팅 발송자)에 따라 다르게 렌더링
## 6-2. 방에 접속하는 라우터 만들기
* 접속 가능한 경우 채팅을 불러와 렌더링
```js
// routes/index.js
router.get('/room/:id', async (req, res, next) => {
    try {
        const room = await Room.findOne({ _id: req.params.id });
        const io = req.app.get('io');
        if (!room) {
            return res.redirect('/?error=존재하지 않는 방입니다.');
        }
        if (room.password && room.password !== req.query.password) {
            return res.redirect('/?error=비밀번호가 틀렸습니다.');
        }
        // io.of('/chat').adapter.rooms 안에 방 목록들이 들어있다.
        const { rooms } = io.of('/chat').adapter;
        // 인원제한
        // rooms[req.params.id]는 방 안의 사용자들
        // rooms[req.params.id].length 방 안의 사용자가 몇 명인지 확인
        if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
            return res.redirect('/?error=허용 인원이 초과하였습니다.');
        }
        const chats = await Chat.find({ room: room._id }).sort('createdAt');
        return res.render('chat', {
            room,
            title: room.title,
            chats,
            user: req.session.color,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});
```
## 6-3. 채팅 라우터 만들기
* 채팅을 DB에 저장 후 방에 뿌려줌
```js
router.post('/room/:id/chat', async (req, res, next) => {
    try {
        const chat = await Chat.create({
            room: req.params.id,
            user: req.session.color,
            chat: req.body.chat,
        });
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});
```
## 6-4. 웹 소켓만으로 채팅 구현하기
* DB를 쓰지 않고도 바로 socket.emit으로 채팅 전송 가능
    * chat.html, app.js 수정하기
```js
// chat.html
document.querySelector('#chat-form').addEventListener('submit', function (e) {
        e.preventDefault();
...
    socket.emit('chat',{
        room: '{{room._id}}',
        user: '{{user}}',
        chat: e.target.chat.value,
    });
    e.target.chat.value = '';
...
```
```js
// socket.js
chat.on('connection', (socket) => {
    ...
    socket.on('disconnect', () => {
        ...
    });
    socket.on('chat', (data) => {
        socket.to(data.room).emit(data);
    });
});
```
## 6-5.기타 Socket.IO API
* 특정인에게 메세지 보내기(귓속말, 1대1 채팅 등에 사용)
* 나를 제외한 전체에게 메시지 보내기
```js
// 특정인에게 메세지 보내기
socket.to(소켓 아이디).emit(이벤트,데이터);
// 나를 제외한 모두에게 메세지 보내기
socket.broadcast.emit(이벤트, 데이터);
socket.broadcast.to(방 아이디).emit(이벤트, 데이터);
```
## 6-6. GIF 전송 구현
* 소스 코드 복사하기
    * chat.html 스크립트 맨 아래에 코드 추가
    * route/index.js에 아래 코드 추가
    * app.js에 아래 코드 추가
    * 이미지 업로드이기 때문에 multer 사용
    * 이미지 저장 후 파일 경로를 chat 데이터에 뿌림
    * 이미지를 제공할 static 폴더 연결
```js
// chat.html
...
document.querySelector('#gif').addEventListener('change', function (e) {
        console.log(e.target.files);
        const formData = new FormData();
        formData.append('gif', e.target.files[0]);
        axios.post('/room/{{room._id}}/gif', formData)
            .then(() => {
                e.target.file = null;
            })
            .catch((err) => {
                console.error(err);
            });
    });
</script>
```
```js
// routes/index.js
...
try {
    fs.readdirSync('uploads');
} catch (err) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
        done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
    try {
      const chat = await Chat.create({
        room: req.params.id,
        user: req.session.color,
        gif: req.file.filename,
      });
      req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
      res.send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

module.exports = router;
```
```js
// app.js
...
app.use(express.static(path.join(__dirname, 'public')));
// 추가
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
...
```
## 6-7. GIF 채팅 해보기
* 다음 장에서는 익명제 대신 로그인한 사용자들 간에 실시간 데이터를 주고 받음

# 스스로 해보기
* 채팅방에 현재 참여자 수나 목록 표시하기(join, exit 이벤트에 socket.adapter.rooms에 들어 있는 참여자 목록 정보를 같이 보내기)
* 시스템 메세지까지 DB에 저장하기(입장용, 퇴장용 라우터를 새로 만들어 라우터에서 DB와 웹 소켓 처리하기)
* 채팅방에서 한 사람에게 귓속말 보내기(화면을 만들고 socket.io(소켓 아이디) 메서드 사용하기)
* 방장 기능 구현하기(방에 방장 정보를 저장한 후 방장이 나갔을 때는 방장을 위임하는 기능 추가하기)
* 강퇴 기능 구현하기(강퇴 소켓 이벤트 추가하기)

# 핵심 정리
* 웹 소켓과 HTTP는 같은 포트를 사용할 수 있으므로 따로 포트를 설정할 필요가 없다.
* 웹 소켓은 양방향 통신이므로 서버뿐만 아니라 프런트엔드 쪽 스크립트도 사용해야 한다.
* Socket.IO를 사용하면 웹 소켓을 지원하지 않는 브라우저에까지 실시간 통신을 구현할 수 있다.
* Socket.IO 네임스페이스와 방 구분을 통해 실시간 데이터를 필요한 사용자에게만 보낼 수 있다.
* app.set('io', io)로 소켓 객체를 익스프레스와 연결하고, req.app.get('io')로 라우터에서 소켓 객체를 가져오는 방식을 기억하자
* 소켓 통신과 함께 데이터베이스 조작이 필요한 경우, 소켓만으로 해결하기보다는 HTTP 라우터를 거치는 것이 좋다.