const router = require('express').Router()
const passport = require('./passport');
const authService = require('./controller');
const checkAuthentication = require('../middleware/checkAuthentication');
router.get('/login/google',passport.authenticate('google', { scope: ['email','profile','openid'] })) 
router.get('/login/github',passport.authenticate('github', { scope: ['user:email'] }))

router.get('/login/google/callback', passport.authenticate('google', { failureRedirect: '/users/login' }), authService.loginWithSocailCallback) 
router.get('/login/github/callback', passport.authenticate('github', { failureRedirect: '/users/login' }), authService.loginWithSocailCallback)
router.get('/login', authService.getLogin);
router.get('/register', authService.getRegister);
router.post('/register', authService.register);
// Users Login Post Route
router.post(
    '/login',
    passport.authenticate('local', {
        successFlash: true,
        successRedirect: '/users/account/profile',
        failureFlash: true,
        failureRedirect: '/users/login',
    }),

);

router.get('/logout', checkAuthentication, authService.logout);
module.exports = router