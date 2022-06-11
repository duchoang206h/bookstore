const router = require('express').Router()
const passport = require('./passport');
const authService = require('./controller');
const checkAuthentication = require('../middleware/checkAuthentication');
router.get('/login/google',passport.authenticate('google', { scope: ['email','profile','openid'] })) 
router.get('/login/github',passport.authenticate('github', { scope: ['user:email'] }))

router.get('/login/google/callback', passport.authenticate('google'), authService.login) 
router.get('/login/github/callback', passport.authenticate('github'), authService.login)
router.get('/login', authService.getLogin);
router.get('/register', authService.getRegister);
router.post('/register', authService.register);
router.get('/confirm', authService.getConfirmEmail);
// Users Login Post Route
router.post('/login', passport.authenticate('local'), authService.login);

router.get('/logout', checkAuthentication, authService.logout);
router.get('/resetpassword', authService.getResetPassword);
router.post('/resetpassword', authService.resetPassword);
router.get('/setpassword', authService.getSetPassword);
router.post('/setpassword', authService.setPassword);
module.exports = router