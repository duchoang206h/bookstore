const db = require('../models')
const { QueryTypes } = require('sequelize')
class AdminService {
    getOrders = async () =>{
        const orders = await db.sequelize.query(
            `select Transactions.status , Orders.id, Orders.phone_number, Orders.address, Orders.user_id, Orders.fullname, Orders.createdAt, Orders.total  from Orders 
                inner join Transactions
                on Orders.id = Transactions.order_id   
            `
            , { type : QueryTypes.SELECT });
        return await Promise.all(orders.map(async order => {
            order.items =  await db.sequelize.query(
                `select Books.title, Books.price, Order_items.amount from Order_items 
                 inner join  Books
                   on Order_items.book_id = Books.id
                   where Order_items.order_id = ?
                   `
                , { replacements: [order.id],
                    type : QueryTypes.SELECT });
            return order
        })) 
    }
    
}
module.exports = new AdminService()