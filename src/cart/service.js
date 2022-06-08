const BaseRepo = require('../repo/BaseRepo')
const db = require("../models");
const { QueryTypes } = require("sequelize");
class CartService extends BaseRepo{
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
    /**
     * @param {Object} item
     * @param {number} item.id
     * @param {number} item.amount
     * **/
    updateItem = async (item) =>{
       return await db.Cart_item.update({ amount: item.amount }, { where: {id: item.id}});
    }
    /**
     *  @return {number}
     * **/
    totalItemPrice = async ( user_id) =>{
       const total =  await db.sequelize.query(`
			select sum(Cart_items.amount*Books.price) as total from Books
				inner join Cart_items
					on Cart_items.book_id = Books.id
				where  Cart_items.cart_id in (
							select id from Carts where user_id = ? )`, {
            replacements: [user_id],
            type: QueryTypes.SELECT
        });
        console.log(total)
       return total[0].total
    }

     deleteItem = async(id) =>{
       return await db.Cart_item.destroy({ where: {id}})
    }

     getAllItemsByUserId = async (user_id) =>{
        return await db.sequelize.query(`
			select Cart_items.id, Books.title, Books.price, Books.description, Cart_items.amount, Cart_items.amount*Books.price as total from Books
				inner join Cart_items
					on Cart_items.book_id = Books.id
				where  Cart_items.cart_id in (
							select id from Carts where user_id = ? )`, {
            replacements: [user_id],
            type: QueryTypes.SELECT
        });
    }
}
module.exports = new CartService();