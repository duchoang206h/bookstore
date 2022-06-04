const db = require('../models');
const passport = require('passport');
const checkAuthentication = require('../middleware/checkAuthentication');

const { QueryTypes } = require('sequelize');
const { ROLE_AMIN, ROLE_USER} = require('../constants')
const cartService = require('../cart/service');
const userService = require('./service')

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
       try {
           await cartService.addItem({ id: req.body.id, amount: req.body.amount}, req.session.user.id);
           return res.status(200).json({msg: "success"});
       }catch (e){
           console.log(e)
           return res.status(500).json({msg: e.message});
       }
    }
    modifyCartItem =  async (req, res) =>{
        try {
         
            if(await cartService.updateItem({id: req.params.id, amount:  req.body.amount})) {
                const total  = await cartService.totalItemPrice(req.session.user.id)
                return res.status(200).json({item: await db.Cart_item.findByPk(req.params.id), total});
            }else {
                return res.status(404).json({ item: null, total: 0})
            }
        } catch (e) {

            return res.status(500).json({message: e, item: null, total:0})
        }
    }
    deleteCartItem = async (req, res) =>{
        try {
            await cartService.deleteItem(req.params.id);
            return res.status(200).json({message:"success"})
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

    getCart = async (req,  res) =>{
        const cart_items = await cartService.getAllItemsByUserId(req.session.user.id);
        const total = await cartService.totalItemPrice(req.session.user.id);
        res.render('users/cart', { cart_items, total })
    }

    getCheckout = async (req,  res) =>{
        const cart_items = await cartService.getAllItemsByUserId(req.session.user.id);
        const total = await cartService.totalItemPrice(req.session.user.id);
        res.render('users/checkout', { cart_items, total })
    }

    placeOrder = async (req, res) =>{
        const  result = await userService.placeOrder(
            {
                user_id: req.session.user.id,
                type:"cod",
                address: req.body.address,
                fullname:req.body.fullname,
                phone_number: req.body.phone_number,
                shipping: 0
            })
        if(result) return res.render('users/thankyou');
        return res.render('users/checkoutError')
    }
}
module.exports = new UserController()