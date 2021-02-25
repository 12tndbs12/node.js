const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
    await sequelize.sync();
});
describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: 'zerocho0@gmail.com',
                nick: 'zerocho',
                password: 'nodejsbook',
            })
            // 가입 성공
            .expect('Location', '/')
            .expect(302, done);
    });
});

describe('POST /login', () => {
    test('로그인 수행', async (done) => {
        request(app)
            .post('/auth/login')
            .send({
                email: 'zerocho0@gmail.com',
                password: 'nodejsbook',
            })
            .expect('Location', '/')
            .expect(302, done);
    });
});

// describe('GET /logout', () => {
//     test('로그인 수행', async () => {
        
//     })
// })

afterAll(async () => {
    await sequelize.sync({ force: true });
})