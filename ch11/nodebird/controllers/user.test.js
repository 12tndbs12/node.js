const { addFollowing } = require('./user');
jest.mock('../models/user');
const User = require('../models/user');

describe('addFollowing',() => {
    const req = {
        user: { id: 1 },
        params: { id: 2 },
    };
    const res = {
        status : jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();
    
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
        // 리턴값을 가짜로 만들어준다. 무조건 저 값이 리턴된다.
        User.findOne.mockReturnValue(Promise.resolve({ 
            id: 1, 
            name: 'zerocho', addFollowings(value) {
                return Promise.resolve(true);
            }
        }));
        await addFollowing(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });
    test('사용자를 못 찾으면 res.status(404).send(no user)를 호출 함', async () => {
        User.findOne.mockReturnValue(Promise.resolve(null));
        await addFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');

    });
    test('DB에서 에러가 발생하면 next(err) 호출', async () => {
        const error = '테스트용 에러';
        // reject하면 try catch애서 catch로 간다.
        User.findOne.mockReturnValue(Promise.reject(error));
        await addFollowing(req, res, next);
        expect(next).toBeCalledWith(error);

    });
});