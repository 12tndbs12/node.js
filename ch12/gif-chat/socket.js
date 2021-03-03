const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, {path: '/socket.io'});
    // 라우터에서 소켓io의 객체 사용
    // req.app.get('io');
    app.set('io',io);
    // 네임스페이스
    const room = io.of('/room');
    const chat = io.of('/chat');

    io.use((socket, next) => {
        cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res || {}, next);
        sessionMiddleware(socket.request, socket.request.res || {}, next);
    });
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
        console.log(req.session.color);
        // console.log(req);
        // 주소에서 roomId를 추출하는 부분
        const roomId = referer
            .split('/')[referer.split('/').length -1]
            .replace(/\?.+/, '');
        socket.join(roomId);
        socket.to(roomId).emit('join', {
            user: 'system',
            chat: `${req.session.color}님이 입장하셨습니다.`,
        });
        // 연결 종료 시
        socket.on('disconnect', () => { 
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);
            const currentRoom = socket.adapter.rooms[roomId];
            const userCount = currentRoom ? currentRoom.length : 0;
            if (userCount === 0) {  // 유저가 0명이면 방 삭제
                // 세션쿠키는 암호화된 쿠키이다.
                // 서명된 쿠키에 접근하는 방법
                // req.signedCookies['connect.sid']
                // req.signedCookies['connect.sid']는 암호화가 없기때문에 다시 암호화
                const signedCookie = cookie.sign(req.signedCookies['connect.sid'], process.env.COOKIE_SECRET);
                const connectSID = `${signedCookie}`;
                // delete요청을 보낸 사람을 알려주기 위한 세션쿠키 전송
                axios.delete(`http://localhost:8005/room/${roomId}`, {
                    headers: {
                        // connect.sid 할때는 앞에 s%3A를 붙여주자
                        Cookie: `connect.sid=s%3A${connectSID}`
                    }
                })
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
    
};