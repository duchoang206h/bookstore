const router = require('express').Router();
const paymentService = require('./service')
const items =  [{
    "name": "Red Sox Hat",
    "sku": "001",
    "price": "25.00",
    "currency": "USD",
    "quantity": 1
}];

const amount =  {
    "currency": "USD",
    "total": "25.00"
};
router.get('/paypal',async (req, res) =>{
    
    
    
    const url = await paymentService.getRedirectUrlPaypal(items, amount);
    
    res.redirect(url);
});
router.get('/paypal/success', async (req, res) =>{
    
    console.log(req.query);

    const { PayerID, paymentId } = req.query;
    
    res.json(await paymentService.executePaymentPaypal(PayerID, paymentId, amount));

});
module.exports = router; 