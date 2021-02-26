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
## 2-8. 클라이언트 하나 종료하기
* 브라우저를 하나 종료하기
  * 콘솔에 접속 해제 메시지가 뜨고, 메시지의 양이 하나가 됨
  * 편의성을 위해 ws 모듈 대신 Socket.IO 모듈 사용


