const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const checkAuthentication = require('../middleware/checkAuthentication');
const db = require('../models');
const { QueryTypes } = require('sequelize');
const userController = require('./controller')
// Users Login Route

router.get('/account/profile', checkAuthentication, userController.getProfile);
router.post('/account/profile', checkAuthentication, userController.updateProfile);
router.get('/account/orders', checkAuthentication, userController.getOrder);
// Cart Route
router.put('/cart', checkAuthentication, userController.addItemToCart);
router.put('/cart/:id',checkAuthentication, userController.modifyCartItem);
// Delete Item
router.delete('/cart/cart_item/:id', checkAuthentication, userController.deleteCartItem);
// Dashboard
router.get('/cart', checkAuthentication, userController.getCart);

router.get('/checkout',checkAuthentication, userController.getCheckout );

router.post('/order', checkAuthentication, userController.placeOrder);



module.exports = router;
