const { github, google } = require("../config/oauth");
const { APP_URL} = require("../config/key");
const Google = require("passport-google-oauth2").Strategy;
const Github = require("passport-github2").Strategy;
const Local = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const userService = require('../user/service');

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
const GithubStrategy = new Github(
  {
    clientID: github.client_id,
    clientSecret: github.client_secret,
    callbackURL: APP_URL+ "/auth/login/github/callback",
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
);
const LocalStrategy = new Local(
  async function(email, password, done) {
    let user;
    try {
      user = await userService.findByEmail(email);
      if (!user) {
        return done(null, false, { message: 'No user by that email'});
      }
    } catch (e) {
      return done(e);
    }
    let match = bcrypt.compareSync(password, user.password)
    if (!match) {
      return done(null, false, { message: 'Not a matching password'});
    }

    return done(null, user);

  }

)

module.exports = {
  GoogleStrategy,
  GithubStrategy,
  LocalStrategy
};
