# 과제
* 팔로잉 끊기(시퀄라이즈의 destory 메서드와 라우터 활용)    --  끝
* 프로필 정보 변경하기(시퀄라이즈의 update 메서드와 라우터 활용)    -- 끝
* 게시글 좋아요 누르기 및 좋아요 취소하기(사용자-게시글 모델 간 N:M 관계 정립 후 라우터 활용)
* 게시글 삭제하기(등록자와 현재 로그인한 사용자가 같을 때, 시퀄라이즈의 destory 메서드와 라우터 활용)
* 매번 데이터베이스를 조회하지 않도록 deserializeUser 캐싱하기(객체 선언 후 객체에 사용자 정보 저장, 객체 안에 캐싱된 값이 있으면 조회)




# 언팔로우
* views/main.html에 추가
```js
...
{% elif followerIdList.includes(twit.User.id) and twit.User.id !== user.id %}
                        <button class="twit-unfollow">팔로우취소</button>
...
<script>
...
        document
            .querySelectorAll('.twit-unfollow')
            .forEach(function (tag) {
                tag.addEventListener('click', function () {
                    // 아이디 받아오기
                    const myId = document.querySelector('#my-id');
                    if (myId) {
                        const userId = tag
                            .parentNode
                            .querySelector('.twit-user-id')
                            .value;
                        if (userId !== myId.value) {
                            if (confirm('팔로잉을 끊으시겠습니까?')) {
                                axios
                                    .post(`/user/${userId}/unfollow`)
                                    .then(() => {
                                        location.reload();
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                    });
                            }
                        }
                    }
                });
            });
...
</script>
```
* routes/user.js에 추가
```js
...
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
...
```

# 프로필 정보 변경하기
* 닉네임만 변경
```js
// profile.html에 추가
    <div>
        <form action="/user/profile" method="post">
            <div class="input-group">
                <label for="modify-nick">닉네임</label>
                <input id="modify-nick" type="text" name="nick">
            </div>
            <button id="modify-btn" type="submit" class="btn">수정</button>
        </form>
    </div>
```
```js
// routes/user.js에 추가
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
```





