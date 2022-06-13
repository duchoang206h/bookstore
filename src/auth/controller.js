const userService = require('../user/service');
const authService = require('./service');
const db = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const day = require('dayjs');
const mailServicee = require('../mail/mailService')
const { ROLE_ADMIN, ROLE_USER, BCRYPT_SALT_ROUNDS, RESET_PASSWORD_TEMPLATE, CONFIRM_EMAIL_TEMPLATE} = require('../constants');
const { APP_URL } = require('../config/key');
class AuthController {
    getLogin = async (req, res) =>{
    
        if(req.session.user){
            if(req.session.user.role_id == ROLE_USER) return res.redirect('/users/account');
            else return res.redirect('/admin');
        }
        else{
            return res.render('users/login')
        }
    }
  
    logout = async (req, res) => {
       
        req.logOut();
        req.session.destroy();

        res.redirect('/books');
    }

    getRegister = async(req, res) =>{
        res.render('users/register', { message: ""})
    }
    register = async (req, res) =>{
        try {
            const newUser = await authService.register(req.body.email, req.body.password, req.body.fullname, req.body.phone_number) ;
            
            if(!newUser) return res.render('users/register', { message:"Email exist!"});
            const randomString = crypto.randomBytes(32).toString('hex');
            const hashToken = bcrypt.hashSync(randomString, BCRYPT_SALT_ROUNDS);
            
            const token = await db.Token.create({user_id: newUser.id, token: hashToken, expired: day(Date.now()+ 3600000)})
            const link = APP_URL+`/auth/confirm?user_id=${newUser.id}&token=${hashToken}`;
            mailServicee.send(newUser.email, CONFIRM_EMAIL_TEMPLATE(link), "Confirm email");
            
            res.render('users/register', { message:"A confirm email has been send to your mail"});
        } catch (error) {
            
        }
    }

    login = (req,res) =>{
        req.session.user = req.user;
        req.session.save(()=>{
            if( req.session.user.role_id == ROLE_ADMIN)  res.redirect('/admin')
            else res.redirect('/')
        })
       
    }
    getResetPassword = async (req, res) => res.render('users/resetPassword', { message:""});
        
    resetPassword = async (req, res) =>{
        const user = await userService.findByEmail(req.body.email)
        if(! user){
           return res.render('users/resetPassword', { message:"Email not exist"});
        }
        const randomString = crypto.randomBytes(32).toString('hex');
        const hashToken = bcrypt.hashSync(randomString, BCRYPT_SALT_ROUNDS);
        
        if(!await db.Token.findOne({ where: { user_id: user.id}})) {
            await db.Token.create({user_id: user.id, token: hashToken, expired: day(Date.now()+ 3600000)})
        }else{
            await db.Token.update({token: hashToken, expired: day(Date.now()+ 3600000)}, { where:{ user_id: user.id}})
        }
        const link = APP_URL +`/auth/setpassword?user_id=${user.id}&token=${hashToken}`
        mailServicee.send(user.email, RESET_PASSWORD_TEMPLATE(link), "Reset Password");

        res.render('users/resetPassword', { message:"An email with reset password link has been sent to your email"});
    }
    getSetPassword = async (req, res) =>{
        try {
        const token = await db.Token.findOne({where:{ user_id: req.query.user_id, token: req.query.token}});
        if(!token) return res.render('partials/_notfound');
        req.session.user_id = req.query.user_id;
        return res.render('users/setPassword');
        } catch (error) {
            console.log(error)
        }
    }
    getConfirmEmail =  async (req, res) =>{
        const token = await db.Token.findOne({where:{ user_id: req.query.user_id, token: req.query.token}});
        if(!token) return res.render('partials/_notfound');
        await db.User.update({active: 1}, { where: { id: req.query.user_id}});
        res.render('users/confirmEmail')
    }
    setPassword = async (req, res) =>{
        try {
            await db.User.update({password: bcrypt.hashSync(req.body.password, BCRYPT_SALT_ROUNDS)}, {where:{ id: req.session.user_id}})
            res.redirect('/auth/login')
        } catch (error) {
            res.redirect('/auth/login')
        }
    }
    }
module.exports = new AuthController()