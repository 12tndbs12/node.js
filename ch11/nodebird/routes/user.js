const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { addFollowing } = require('../controllers/user');

const router = express.Router();

// POST /user/1/follow
router.post('/:id/follow', isLoggedIn, addFollowing);

module.exports = router;