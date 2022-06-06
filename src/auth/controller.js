const userService = require('../user/service');
const authService = require('./service');
const db = require('../models');
const { ROLE_AMIN, ROLE_USER} = require('../constants')
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
    }
module.exports = new AuthController()