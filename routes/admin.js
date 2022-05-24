const express = require('express');
const router = express.Router();
const checkAuthorization = require('../middleware/checkAuthorization');
const day = require('dayjs')
const multer = require('multer');
const { QueryTypes } = require("sequelize")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const name = day().format('DD_MM_YYYY') + '_book_' + req.params.id + ".png"
      cb(null, name)
    }
  })
const upload = multer({ storage : storage});
const db = require('../models');

router.get('/', async (req, res) => {
    
    const totalProduct = await db.sequelize.query(`select count(*) as count from Books`, {type: QueryTypes.SELECT});
    const totalOrder = await db.sequelize.query(`select count(*) as count from Orders`, {type: QueryTypes.SELECT});
    const totalOrderMoney = await db.sequelize.query(`select sum(total) as total from Orders`, {type: QueryTypes.SELECT});
    res.render('admin/dashboard', {totalProduct:totalProduct[0].count  , totalOrder:totalOrder[0].count, totalOrderMoney: totalOrderMoney[0].count});
});
router.get('/products', async (req, res) => {
    /* const books = await Book.find();
    const users = await User.find();
    const orders = await Order.find().sort({createdAt:-1}).populate("user").populate("details.book").exec();
    console.log(orders); */
    const books = await db.Book.findAll();
    res.render('admin/product', { books: books });
});
router.get('/products/:id/edit', async (req, res) => {
    
    const book = await db.Book.findOne({where: {id: req.params.id}});
    res.render('admin/product_edit', { book });
});

router.put('/products/:id/edit/image', upload.single('image'), async (req, res) => {
    const newImg = "/images/"+ req.file.filename;
    const book = await db.Book.update({image: newImg}, { where: {id: req.params.id}})
   res.status(200).json({book});
});
router.put('/products/:id/edit', async (req, res) => {
   const book = db.Book.update(req.body, {where : {id: req.params.id}})
   res.status(200).json({ book });
});
router.delete('/products/:id/delete', async (req, res) => {
    const book = db.Book.destroy( {where : {id: req.params.id}})
    res.status(200).json({ book });
 });
 router.post('/products/create', async (req, res) => {
   const {price, title, description} = req.body;
   const book = await db.Book.create({price, title, description});
   res.status(200).json({book})
 });
 router.get('/products/create', async (req, res) => {
    res.render('admin/product_create', {book:{}})
  });

 router.get("/order", async(req,res)=>{

 })
module.exports = router;