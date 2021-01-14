const exec = require('child_process').exec;

// var process = exec('cmd /c chcp 65001>nul && dir');
var process = exec('dir');

process.stdout.on('data', function (data) {
    console.log(data.toString());
});
process.stderr.on('data', function (data) {
    console.error(data.toString());
});

// 한글이 깨질때
// cmd /c chcp 65001>nul && dir로 exec 명령어를 수정하면 유니코드를 콘솔에 표시한다.