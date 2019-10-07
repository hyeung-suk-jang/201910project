const passport = require('passport');
const local = require("./localstrategy");
const db = require("../db");


//serialize 처리 해주어야함.(세션에 넣어줘야함)
module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log("passport session save : ", user.id);
    done(null, user.id);
  });
  //요청시 세션값 뽑아서 페이지 전달
  passport.deserializeUser((id, done) => {
    console.log("passport session get id : ", id);
    db.query("select * from user where id = ? ", [id],function(err,rows) {
      var user = rows[0];
      done(err, user);
  });
});
local(passport);
};