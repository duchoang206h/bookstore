const BaseService = require('../interfaces/BaseService');

const db = require("../../models");
const { QueryTypes } = require("sequelize");
const cartService = require('../cart/service')
class UserService extends BaseService{
    constructor(model) {
        super(model);
    }
    /***
     * @param {object} orderInfor
     * @param { string} orderInfor.phone_number
     * @param { string} orderInfor.address
     * @param { string} orderInfor.fullnamee
     * @param { number} orderInfor.shipping
     * @param { number} orderInfor.user_id
     * @param { string} orderInfor.type
     * */
    placeOrder = async  (orderInfor) =>{
        console.log(orderInfor)
        const t = await db.sequelize.transaction();
        try {
          

            const total  =  await cartService.totalItemPrice(orderInfor.user_id);
            
            const order = await db.Order.create({ phone_number: orderInfor.phone_number, address: orderInfor.address,
                    fullname: orderInfor.fullname, total, shipping: 0, user_id: orderInfor.user_id },
                { transaction: t}
            );
           
            const cart_items =  await db.sequelize.query(`
			select Books.id as book_id, Cart_items.amount, ${orderInfor.user_id} as user_id,  ${order.id} as order_id from Books
				inner join Cart_items
					on Cart_items.book_id = Books.id
				where  Cart_items.cart_id in (
							select id from Carts where user_id = ? )`, {
			replacements: [orderInfor.user_id],
			type: QueryTypes.SELECT
		    });
            const order_items = await db.Order_item.bulkCreate(
                cart_items
                ,{ transaction: t});

            const transaction = await db.Transaction.create({ type: orderInfor.type, status: 1, user_id: orderInfor.user_id, order_id: order.id}, { transaction: t})
            await t.commit();

            return true
        }catch (e) {
            console.log(e)
            await t.rollback();
            return false
        }
    }
}
module.exports = new UserService();