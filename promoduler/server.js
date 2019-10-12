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

//정적파일 접근위한 절대경로 지정
app.use('/static', express.static(__dirname + '/public'));

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

// POST 요청의 데이터를 추출하는 미들웨어. 클라이언트의 form값을 req.body에 저장
//extended 는 중첩된 객체표현 허용여부. 객체 안에 객체를 파싱할 수 있게하려면 true.
//내부적으로 true 를 하면 qs 모듈을 사용, false 면 query-string 모듈을 사용.
app.use(express.urlencoded({ extended: true }));

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
  passport.authenticate('local', function(err, user, info) { // passport/localStrategy.js를 실행
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