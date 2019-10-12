const LocalStrategy = require("passport-local").Strategy;
const db = require("../db");


//strategy를 등록, 이걸 사용하기 위해서 등록한 거임.
//인증처리는 실제여기서. db 조회 로직 여기다가 작성하고,
//밑에 post로 들어오면 여기서 체크하는 것임.
module.exports = passport => {
  passport.use(new LocalStrategy(
      {
        usernameField: "email", // 여기서 email,pw의 값은 index.html의 form에서 해당하는 name값이여야 함
        passwordField: "password"
      },
      function(username, password, done) {
        console.log(username);
        //로그인 인증처리
        db.query("SELECT * FROM user WHERE `email`=?",[username],
        function(err,rows) {
          var user = rows[0]; //쿼리문의 결과의 첫번째 항을 user에 대입
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }
          if (user.password !== password) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
          //세션에 담을 정보.
        });
      }
    )
  );
};

