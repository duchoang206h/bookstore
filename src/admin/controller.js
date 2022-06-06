const db = require("../models");
const BaseRepo = require("../interfaces/BaseRepo");
const { QueryTypes  } = require('sequelize')
const orderRepo = new BaseRepo(db.Order);
const adminService = require('./service')
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
        const categories = await db.Category.findAll()
        res.render('admin/product_edit', { book, categories });
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
        const categories = await db.Category.findAll()
        res.render('admin/product_create', {categories})
     };
    createProduct = async (req, res) => {
        const { price, title, description, category_id } = req.body;
        const book = await bookService.create({ price, title, description, category_id});
        res.status(200).json({book})
    }
    getOrders =  async (req, res) => {
        const orders =  await adminService.getOrders();
        res.render('admin/order', { orders })
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