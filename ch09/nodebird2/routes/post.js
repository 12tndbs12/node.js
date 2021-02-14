const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');
const { Router } = require('express');

const router = express.Router();

try {
    fs.readdirSync('uploads')
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
// 이미지
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null,'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024},
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}`});
});

// 게시글
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g); //해시태그 정규표현식
        //  [#노드, #익스프레스]
        // hashtags.map은 [노드, 익스프레스]로 만든다.
        // [findorCreate(노드), findOrCreate(익스프레스)]
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
                // Hashtag.upsert : update와 insert를 합친거
            );
            console.log(result);
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/like', async (req, res, next)=> {
    try {
        const post = await Post.findOne({where: {id: req.params.id}});
        await post.addLiker(req.user.id);
        // const twit2 = await post.getLiker({ include: [{model: Post, attributes: ['id'] }] });
        console.log(twit2);
        // res.render('main', {
            // twit: "req.twit and (twit.Liker.map(function(l){return l.id}).include(req.user.id))",
            // hi: twit2,
        // });
        res.send('OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:id/unlike', async (req, res, next)=> {
    try {
        const post = await Post.findOne({where: {id: req.params.id}});
        await post.removeLiker(req.user.id);
        // res.render('main', {
        //     twit: post,
        // });
        res.send('OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
