const router = require('express').Router()
const { callback } = require('./callback')
const passport = require('./passport')
router.get('/login/google',passport.authenticate('google', { scope: ['email','profile','openid'] })) 
router.get('/login/github',passport.authenticate('github', { scope: ['user:email'] }))

router.get('/login/google/callback', passport.authenticate('google', { failureRedirect: '/users/login' }),callback) 
router.get('/login/github/callback', passport.authenticate('github', { failureRedirect: '/users/login' }),callback)
module.exports = router