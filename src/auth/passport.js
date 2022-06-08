const passport = require("passport");
const {
  GoogleStrategy,
  GithubStrategy,
  LocalStrategy
} = require("./passportStatergies");
passport.serializeUser(function (user, done) {
 
  done(null, user);
});

passport.deserializeUser(function (user, done) {

  done(null, user);
});
passport.use(GoogleStrategy);
passport.use(GithubStrategy);
passport.use(LocalStrategy);

module.exports = passport;
