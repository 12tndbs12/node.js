const SSE = require('sse');

module.exports = (server) => {
    const sse = new SSE(server);
    sse.on('connection', (client) => {  // 서버센트 이벤트 연결
        setInterval(() => {
            client.send(Date.now().toString());
        }, 1000);
    });
};