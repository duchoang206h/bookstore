const { github, google } = require("../../config/oauth");
const { APP_URL} = require("../../config/key");
const Google = require("passport-google-oauth2").Strategy;
const Github = require("passport-github2").Strategy;
const GoogleStrategy = new Google(
  {
    clientID: google.client_id,
    clientSecret: google.client_secret,
    callbackURL: APP_URL+"/auth/login/google/callback",
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
);
/* const GithubStrategy = new Github(
  {
    clientID: github.client_id,
    clientSecret: github.client_secret,
    callbackURL: APP_URL+ "/auth/login/github/callback",
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
); */

module.exports = {
  GoogleStrategy,
/*   GithubStrategy, */
};
