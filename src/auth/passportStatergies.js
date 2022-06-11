const { github, google } = require("../config/oauth");
const { APP_URL} = require("../config/key");
const Google = require("passport-google-oauth2").Strategy;
const Github = require("passport-github2").Strategy;
const Local = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const userService = require('../user/service');
const db = require('../models');
const { USER_ACTIVE_CODE } = require("../constants");

const GoogleStrategy = new Google(
  {
    clientID: google.client_id,
    clientSecret: google.client_secret,
    callbackURL: APP_URL+"/auth/login/google/callback",
  },
  async function (accessToken, refreshToken, profile, done) {
    const email = profile.email || profile._json.email
    const [user,_] = await db.User.findOrCreate(
        {   where:  { email },
            default: {
                fullname: profile.displayName,
                auth: profile.provider,
                active: USER_ACTIVE_CODE
            }
        });
    return done(null, user);
  }
);
const GithubStrategy = new Github(
  {
    clientID: github.client_id,
    clientSecret: github.client_secret,
    callbackURL: APP_URL+ "/auth/login/github/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.email || profile._json.email
    const [user,_] = await db.User.findOrCreate(
        {   where:  { email },
            default: {
                fullname: profile.displayName,
                auth: profile.provider,
                active: USER_ACTIVE_CODE
            }
        });
    return done(null, user);
  }
);
const LocalStrategy = new Local(
  {
    usernameField: "email",
    passwordField: "password"
 },
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
