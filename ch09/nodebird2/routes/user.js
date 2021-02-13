const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const { route } = require('./page');

const router = express.Router();

// POST /user/1/follow
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            // get~~~는 관계있는 로우 조회
            // add~~~는 관계 생성
            // set~~~는 관계 수정
            // remove~~~는 관계 제거
            // addFollowings는 추가, setFollowings는 수정 set은 기존 등록 된거를 다 제거하고 추가한다.
            // removeFollowings는 제거
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('success');
        }else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 언팔로우 부분
router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            await user.removeFollowing(parseInt(req.params.id, 10));
            res.send('success');
        }else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 프로필 수정부분 (닉네임)
router.post('/profile', async (req, res, next) => {
    try {
        await User.update({ nick: req.body.nick }, {
            where: {id: req.user.id},
        });
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;