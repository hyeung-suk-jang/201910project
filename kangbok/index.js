// require
const express = require('express');
const express_session = require('express-session');
const morgan = require('morgan');
const cookie_parser = require('cookie-parser');
const passport = require('passport');

const path = require('path');
const db = require('./models');
const passportConfig = require('./passport');

const userRouter = require('./routes/user');
require('dotenv').config();

// 서버 실행
const app = express();

// 미들웨어 세팅

db.sequelize.sync()
passportConfig();

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(cookie_parser(process.env.COOKIE_SECRET));
app.use(express_session({
  resave:false,
  saveUninitialized:false,
  secret: process.env.COOKIE_SECRET,
  cookie:{
    httpOnly:true,
    secure:false
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended:true}));

// passport 부분
app.use(passport.initialize());
app.use(passport.session());

app.use('/user',userRouter);



// 에러 처리

// 포트 열기
app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);
  });