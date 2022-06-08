const userService = require('../user/service');
const authService = require('./service');
const db = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const day = require('dayjs');
const mailServicee = require('../mail/mailService')
const { ROLE_AMIN, ROLE_USER, BCRYPT_SALT_ROUNDS, RESET_PASSWORD_TEMPLATE} = require('../constants')
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
  
    logout = (req, res) => {
       
        req.logOut();
        req.session.destroy();

        res.redirect('/books');
    }

    getRegister = async(req, res) =>{
        res.render('users/register', { message: ""})
    }
    register = async (req, res) =>{
        if(! await authService.register(req.body.email, req.body.password, req.body.fullname, req.body.phone_number) )
            return res.render('users/register', { message:"Email exist!"});
        res.redirect('/')
    }

    loginLocal = async (req,res) =>{
        req.session.user = req.user;
        res.redirect('/')
    }
    loginWithSocailCallback = async (req, res) =>{
        const [user,_] = await db.User.findOrCreate(
            {   where:  { email: req.user.email},
                default: {
                    fullname: req.user.displayName,
                    auth: req.user.provider
                }
            });
        req.session.user = user;
        if(user.role_id == 1)  res.redirect('/admin')
        else res.redirect('/')
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
        const link = `http://localhost:3000/auth/setpassword?user_id=${user.id}&token=${hashToken}`
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