const express = require('express');
const User = require('../schemas/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find({});
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;