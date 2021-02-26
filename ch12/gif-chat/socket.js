const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    // 웹 소켓 연결 시
    wss.on('connection', (ws, req) => {
        // ip 파악
        // 강의에서는 req.connection.remoteAddress;
        const ip = req.headers['x-forwared-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속', ip);
        // 클라이언트로부터 메세지
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
            // clearInterval(ws.interval);
        });
        // 3초마다 클라이언트로 메세지 전송
        ws.interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메세지를 보냅니다.');
            }
        }, 3000);
    });
};