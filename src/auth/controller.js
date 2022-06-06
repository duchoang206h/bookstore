const userService = require('../user/service');
const authService = require('./service');
const db = require('../models')
class AuthController {
    getLogin = async( req, res) =>{
        res.render('users/login', { message: "" } )
    };
    login = async (req, res) =>{}
    getRegister = async(req, res) =>{
        res.render('users/register', { message: ""})
    }
    register = async (req, res) =>{
        if(! await authService.register(req.body.email, req.body.password, req.body.fullname, req.body.phone_number) )
            return res.render('users/register', { message:"Email exist!"});
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
    }
module.exports = new AuthController()