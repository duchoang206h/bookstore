const db = require("../../models");
const BaseService = require("../interfaces/BaseService");
const { QueryTypes  } = require('sequelize')
const orderService = new BaseService(db.Order);
const order_itemsSevice = new BaseService(db.Order_items);
const bookService = require('../book/service')

class AdminController {
    index = async (req, res) =>{
        const totalProduct = bookService.count();
        const totalOrder = orderService.count();
        const [{sum: totalOrderMoney}] = await orderService.sum("total");
        const [{sum: totalProductSold}] = await order_itemsSevice.sum("amount");
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
            `select * from orders 
             inner join order_items 
               on order.id = order_items.order_id
            
       `, { type :QueryTypes.SELECT })
        res.render('admin/order', { orders })
    }
    updateOrder = async (req, res) => {
        try {
            const { id } = req.body;
            await orderService.update(id, { status : 1});
            res.status(200).json({ msg:"Update success"});
        }catch (e) {
            res.status(500).json({ msg:"Internal error"})
        }
    }

}
module.exports = new AdminController()