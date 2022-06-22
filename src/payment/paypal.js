const paypal = require('paypal-rest-sdk');
const  { promisify } = require('util')
const { APP_URL } = require('../config/key')
const { client_id, mode, client_secret} = require('../config/paypal');
paypal.configure({
    mode: mode,
    client_id: client_id,
    client_secret: client_secret
})
/***
 *
 * @param {Object} items
 * @param {string} items.name
 * @param {string} items.sku
 * @param {string} items.price
 * @param {string} items.currency
 * @param {number} items.quantity
 * @param {Object} amount
 * @param {String} amount.currency
 * @param {String} amount.total
 * @param {string} description
 * @return {{redirect_urls: {return_url: string, cancel_url: string}, transactions: [{amount, item_list: {items}, description: string}], intent: string, payer: {payment_method: string}}}
 */

function create_payment_json (items, amount, description =""){
    return {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": APP_URL+ "/payment/paypal/success",
            "cancel_url": APP_URL+ "/payment/paypal/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": items
            },
            "amount": amount,
            "description": description
        }]
    }
}

/***
 * @param {string} payerId
 * @param {Object} amount
 * @param {String} amount.currency
 * @param {String} amount.total
 * @return {{payer_id, transactions: [{amount}]}}
 */
function execute_payment_json (payerId,amount) {
    return {
        "payer_id": payerId,
        "transactions": [{
            "amount": amount
        }]
    }
}
// Promisify callback function
paypal.payment.create = promisify(paypal.payment.create);
paypal.payment.execute = promisify(paypal.payment.execute);
module.exports = { paypal, create_payment_json, execute_payment_json};