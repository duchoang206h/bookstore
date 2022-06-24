const BaseRepo = require('../repo/BaseRepo');

const db = require("../models");
const { QueryTypes } = require("sequelize");
const cartService = require('../cart/service')
class UserService extends BaseRepo{
    constructor(model) {
        super(model);
    }

    findByEmail = async (email)=>{
        return await this.model.findOne({where:{ email} })
    }
    findOrCreate =  async (whereOject, defaultOject) =>{
        return this.model.findOrCreate({
            where: whereOject,
            default: defaultOject
        })
    }
    findOne =  async (whereOject) =>{
        return this.model.findOne({ where: whereOject})
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

            const transaction = await db.Transaction.create({ type: orderInfor.type, status: 0, user_id: orderInfor.user_id, order_id: order.id}, { transaction: t})
            await t.commit();

            return true;
        }catch (e) {
            await t.rollback();
            return false
        }
    };
    getOrderItems = async (user_id) =>{
        return await db.sequelize.query(`
        select Books.id, Books.title, Books.price, Cart_items.amount from Books
        inner join Cart_items
            on Cart_items.book_id = Books.id
        where  Cart_items.cart_id in (
                    select id from Carts where user_id = ?)`, {
			replacements: [user_id],
			type: QueryTypes.SELECT
		    });
    };
    getOrders = async (user_id) =>{
        try {
            let orders = await db.Order.findAll({
                where: {user_id: user_id},
               include:{ model: db.Order_item, as:"items", include:{ model: db.Book}},
             
               });
               
               orders = orders.map(order => {
                 let items = order.items.map( item =>{
                   return { 
                     amount: item['amount'],
                     title: item['Book'].title,
                     image: item['Book'].image,
                     price: item['Book'].price,
                     total: item['amount'] * item['Book'].price
                   }
                 });
                 
                 return Object.assign(order, { items })
               });
               return orders
    
        } catch (error) {
            return []
        }
    }
}
module.exports = new UserService(db.User);