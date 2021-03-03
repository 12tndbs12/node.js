const express = require('express');

// 스키마 가져오기
const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        // 모든 방을 찾아서
        const rooms = await Room.find({});
        // main에 render
        res.render('main', { rooms, title: 'GIF 채팅방' });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/room', (req, res) => {
    res.render('room', { title: 'GIF 채팅방 생성'});
});

router.post('/room', async (req, res, next) => {
    try {
        // 방 생성
        const newRoom = await Room.create({
            title: req.body.title,
            max: req.body.max,
            // 방장은 색깔로 구별
            owner: req.session.color,
            password: req.body.password,
        });
        // socket.js 에서
        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);
        // 방 생성후 입장
        res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/room/:id', async (req, res, next) => {
    try {
        const room = await Room.findOne({ _id: req.params.id });
        const io = req.app.get('io');
        if (!room) {
            return res.redirect('/?error=존재하지 않는 방입니다.');
        }
        if (room.password && room.password !== req.query.password) {
            return res.redirect('/?error=비밀번호가 틀렸습니다.');
        }
        // io.of('/chat').adapter.rooms 안에 방 목록들이 들어있다.
        const { rooms } = io.of('/chat').adapter;
        // 인원제한
        // rooms[req.params.id]는 방 안의 사용자들
        // rooms[req.params.id].length 방 안의 사용자가 몇 명인지 확인
        if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
            return res.redirect('/?error=허용 인원이 초과하였습니다.');
        }
        const chats = await Chat.find({ room: room._id }).sort('createdAt');
        return res.render('chat', {
            room,
            title: room.title,
            chats,
            user: req.session.color,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});
// 모든 사용자가 채팅방을 나갔을때 2초뒤 폭파
router.delete('/room/:id', async (req, res, next) => {
    try {
        // 방 삭제
        await Room.remove({ _id: req.params.id });
        // 채팅 내용 삭제
        await Chat.remove({ room: req.params.id });
        res.send('ok');
        // 먼저 보내서 방 목록 보고 있는 사람들에게서 지우고
        req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        // 마지막으로 방 나간 사람에게는 방이 지워지게
        setTimeout(() => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        }, 2000);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/room/:id/chat', async (req, res, next) => {
    try {
        const chat = await Chat.create({
            room: req.params.id,
            user: req.session.color,
            chat: req.body.chat,
        });
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;