const BaseService = require('../interfaces/BaseService')
const db = require("../../models");
class CartService extends BaseService{
    constructor(model) {
        super(model);
    }
    /**
     * @param {Object} item
     * @param {number} item.id
     * @param {number} item.amount
     * @param {number} user_id
     * **/
    addItem = async (item, user_id) =>{
        const [cart, created] = await db.Cart.findOrCreate({
            where: { user_id }});
        const cart_item = await db.Cart_item.findOne({where:{ cart_id: cart.id, book_id: item.id}});
        if(cart_item) await db.Cart_item.update({amount:cart_item.amount + item.amount}, { where:{id: cart_item.id}})
        else{
            await db.Cart_item.create({ amount: item.amount, book_id: item.id, cart_id: cart.id})
        }
    }
}
module.exports = new CartService();