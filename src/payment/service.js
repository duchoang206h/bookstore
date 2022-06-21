const { create_payment_json, execute_payment_json, paypal} = require("./paypal")

class PaymentService {
    
    getRedirectUrlPaypal = async (items, amount) =>{
        const result = await paypal.payment.create(create_payment_json(items, amount));
        return result.links.find(link => link.rel =="approval_url")['href'];
    };
    
    executePaymentPaypal = async (PayerID, paymentId, amount ) =>{
        return await paypal.payment.execute(paymentId, execute_payment_json(PayerID, amount));
    } 
}
module.exports = new PaymentService();