const db = require("../models");
const BaseRepo = require("../interfaces/BaseRepo");
const { QueryTypes  } = require('sequelize')
const orderRepo = new BaseRepo(db.Order);

const order_itemsRepo = new BaseRepo(db.Order_item);
const bookService = require('../book/service')

class AdminController {
    index = async (req, res) =>{
        const totalProduct = await bookService.count();
        const totalOrder = await orderRepo.count();
        const [{ sum: totalOrderMoney}] = await orderRepo.sum("total");
        const [{ sum: totalProductSold}] = await order_itemsRepo.sum("amount");
        res.render('admin/dashboard', {totalProduct  , totalOrder, totalOrderMoney, totalProductSold});
    }
    getProducts = async (req, res) =>{
        if(req.query.search){
            const books = await bookService.searchByTitle(req.query.search)
            return  res.render('admin/product', { books: books });
        }
        const books = await bookService.findAll();
        res.render('admin/product', { books: books });
    }
    getProductEdit = async (req, res) =>{
        const book = await bookService.findById(req.params.id);
        res.render('admin/product_edit', { book });
    }
    updateProductImage = async (req, res) =>{
       try {
        const newImg = "/images/"+ req.file.filename;
        const book = await bookService.update(req.params.id, {image: newImg})
        res.status(200).json({book});
       } catch (error) {
        res.status(500).json({book: null});
       }
    }
    updateProduct = async (req, res) =>{
      try {
        const book = db.Book.update(req.body, {where : {id: req.params.id}})
        res.status(200).json({ book });
      } catch (error) {
        res.status(500).json({book: null});
      }
    }
    deleteProduct = async (req, res) => {
        const book = await bookService.delete(req.params.id)
        res.status(200).json({ book });
     };

    getCreateProduct = async (req, res) => {
        res.render('admin/product_create')
     };
    createProduct = async (req, res) => {
        const { price, title, description } = req.body;
        const book = await bookService.create({price, title, description});
        res.status(200).json({book})
    }
    getOrders =  async (req, res) => {
        const orders = await db.sequelize.query(
            `select Transactions.status , Orders.id, Orders.phone_number, Orders.address, Orders.user_id, Orders.fullname, Orders.createdAt, Orders.total  from Orders 
                inner join Transactions
                on Orders.id = Transactions.order_id   
            `
            , { type : QueryTypes.SELECT });
        const result = await Promise.all(orders.map(async order => {
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
        res.render('admin/order', { orders: result })
    }
    updateOrder = async (req, res) => {
        try {
            const id  = req.params.id;
            console.log(id)
            await db.Transaction.update({status: 1 }, {where:{ order_id: id}});
            res.status(200).json({ msg:"Update success"});
        }catch (e) {
            res.status(500).json({ msg:"Internal error"})
        }
    }

}
module.exports = new AdminController()