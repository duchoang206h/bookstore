const router = require('express').Router();
const paymentService = require('./service');
const userService = require('../user/service');
const cartService = require('../cart/service');
const { USD_DONG } = require('../constants');
const paymentController = require('./controller')

//Redirect to paypal url payment
router.get('/paypal', paymentController.getPaypalRedirectUrl);

//Payment success 
router.get('/paypal/success', paymentController.paypalSuccess);

//Payment error
router.get('/paypal/cancel', paymentController.paypalCancel);

module.exports = router; 