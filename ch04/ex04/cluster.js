const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`마스터 프로세스 아이디: ${process.pid}`);
    // CPU 개수만큼 워커를 생산한다.
    for (let i = 0; i < numCPUs; i += 1) {
        cluster.fork();
    }
    // 워커가 종료되었을 때
    cluster.on('exit', (worker,code, signal) => {
        console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
        console.log('code', code, 'signal', signal);
        // 종료되고 다시 생성되게 하려면
        cluster.fork();
    });
} else {
    // 워커들이 포트에서 대기
    http.createServer(async (req, res) => {
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
        res.write('<h1>Hello Node!</h1>');
        res.end('<p>Hello Cluster!</p>');
        setTimeout(() => {
            // 워커가 존재하는지 확인하기 위해 1초마다 종료한다.
            process.exit(1);
        }, 1000);
    }).listen(8086);
    console.log(`${process.pid}번 워커 실행`);
}