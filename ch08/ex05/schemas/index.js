const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const connect = () => {
    // 개발 환경일 때만 콘솔을 통해 몽구스가 생성하는 쿼리 내용을 확인할 수 있게 하는 코드이다.
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    // 몽구스와 몽고디비를 연결하는 부분이다. 몽고디비 주소로 접속을 시도한다.
    // 접속을 시도하는 주소는 admin이지만, dbName옵션으로 nodejs데이터베이스를 사용한다.
    //useNewUrlParser, useCreateIndex는 사용하지 않아도 되지만 콘솔에 경고 메세지가 뜬다.
    mongoose.connect(`mongodb://root:${process.env.MONGODB}@localhost:27017/admin`, {
        dbName: 'nodejs',
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    }, (error) => {
        if (error) {
            console.log('몽고디비 연결 에러', error);
        } else {
            console.log('몽고디비 연결 성공');
        }
    });
};
// 몽구스 커넥션 이벤트리스너
// 에러 발생시 에러 내용기록, 연결 종료시 재연결시도
mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
});

module.exports = connect;