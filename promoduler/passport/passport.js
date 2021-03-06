const passport = require('passport');
const local = require("./localstrategy");
const db = require("../db");


//serialize 처리 해주어야함.(세션에 넣어줘야함)
module.exports = () => {
  passport.serializeUser((user, done) => { // req.login()에서 넘겨준 user값
    console.log("passport session save : ", user.id);
    done(null, user.id); // user에서 id만 세션에 저장
  });
  //요청시 세션값 뽑아서 페이지 전달
  passport.deserializeUser((id, done) => { // 매개변수 id는 세션에 저장됨 값(req.session.passport.user)
    console.log("passport session get id : ", id);
    db.query("select * from user where id = ? ", [id],function(err,rows) {
      var user = rows[0];
      done(null, user);
  });
});
local(passport);
};