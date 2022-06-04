const passport = require("passport");
const {
  GoogleStrategy,
  GithubStrategy,
} = require("./passportStatergies");
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(GoogleStrategy);
module.exports = passport;
