const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const indexRouter = require('./routes/index.js');
const userRouter = require('./routes/user.js');

const app = express();
app.set('port', process.env.PORT || 3003);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser('no'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'no',
    cookie: {
        httpOnly: true,
        secure: false
    },
    name: 'session-cookie'
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    res
        .status(404)
        .send('Not Found');
});

app.use((err, req, res, next) => {
    console.error(err);
    res
        .status(500)
        .send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});