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