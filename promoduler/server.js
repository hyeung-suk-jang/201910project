const express = require('express');

const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

//process.env 사용
require('dotenv').config();

const port = process.env.SERVER_PORT;

const passport = require("passport");
const passportConfig = require("./passport/passport");

const app = express();
const db = require('./db');
passportConfig();

// req.body를 json으로 쓰기 위한 설정
app.use(express.json());

// req.session.destroy();사용하기 위해 express-session 
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false // https를 쓸 때 true
  }
};

app.use(
  expressSession(sessionOption)
);

app.use(passport.initialize());
app.use(passport.session());


// 정상 동작하는지 테스트
app.get("/", (req, res) => {
  db.query('select * from user',function(err,rows){
    res.send(rows);
  });
});

//login
//커스텀 콜백사용할 예정(ajax니깐 json 응답을 줘야하기때문에 커스텀 콜백사용)
app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    console.log(user);
    if (err) { return next(err);}
    if (!user) { return res.redirect('/login'); }
    // req.login을 이용해서 serialize 기능이 자연스럽게 이어지도록 되어있음.
    req.logIn(user, function(err) {
      if (err) {return next(err);}
      return res.json({status:200});
    });
  })(req, res, next); //authenticate 반환 메서드에 이 인자를 넣어서 처리해야함.
});

app.get("/dotenv",(req,res)=>{
  res.send(process.env.DB_NAME);
});
// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구


app.listen(port, () => console.log(`Listening on port ${port}`));