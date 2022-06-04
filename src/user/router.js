const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const checkAuthentication = require('../middleware/checkAuthentication');
const db = require('../models');
const { QueryTypes } = require('sequelize');
const userController = require('./controller')
// Users Login Route
router.get('/login', userController.getLogin);

// Users Login Post Route
router.post(
    '/login',
    passport.authenticate('local', {
        successFlash: true,
        successRedirect: '/users/dashboard',
        failureFlash: true,
        failureRedirect: '/users/login',
    }),

);

router.get('/logout', userController.logout);

// Cart Route
router.put('/cart', checkAuthentication, userController.addItemToCart);
router.put('/cart/:id',checkAuthentication, userController.modifyCartItem);
// Delete Item
router.delete('/cart/cart_item/:id', checkAuthentication, userController.deleteCartItem);
// Dashboard
router.get('/cart', checkAuthentication, userController.getCart);

router.get('/checkout',checkAuthentication, userController.getCheckout );

router.post('/order', checkAuthentication, userController.placeOrder);

router.get('/orders', checkAuthentication, async (req, res) => {

});

module.exports = router;
