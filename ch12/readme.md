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

