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
        // 연결 종료 시
        socket.on('disconnect', () => { 
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);
        });
    })
    
};