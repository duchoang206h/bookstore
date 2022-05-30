const passport = require('passport');
const checkAuthentication = require('../middleware/checkAuthentication');
const db = require('../models');
const { QueryTypes } = require('sequelize');
const { ROLE_AMIN, ROLE_USER} = require('../constants')
const cartService = require('../cart/service')
class UserController {
    getLogin = async (req, res) =>{
        if(req.user){
            if(req.session.user.role_id == ROLE_USER) return res.redirect('/');
            else return res.redirect('/admin');
        }
        else{
            return res.render('users/login')
        }
    }
    login = async (req, res) =>{
        if(req.user){
            if(req.session.user.role_id == ROLE_USER) return res.redirect('/');
            else return res.redirect('/admin');
        }
        else{
            return res.render('users/login')
        }
    }
    logout = (req, res) => {
        req.logOut();
        res.redirect('/books');
    }

    addItemToCart =  async (req, res) =>{
        await cartService.addItem({ id: req.book.id, amount: req.body.amount}, req.session.user.id);

    }
}
module.exports = new UserController()