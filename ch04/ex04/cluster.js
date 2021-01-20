const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`마스터 프로세스 아이디: ${process.pid}`);
    // CPU 개수만큼 워커를 생산한다.
    for (let i = 0; i < numCPUs; i += 1) {
        cluster.fork():
    }
    // 워커가 종료되었을 때
}