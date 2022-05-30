const express = require('express');
const router = express.Router();
const checkAuthorization = require('../middleware/checkAuthorization');
const day = require('dayjs')
const multer = require('multer');
const { QueryTypes, Op } = require("sequelize")
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
    
    const [{count: totalProduct}] = await db.sequelize.query(`select count(*) as count from Books`, {type: QueryTypes.SELECT});
    const [{count: totalOrder}] = await db.sequelize.query(`select count(*) as count from Orders`, {type: QueryTypes.SELECT});
    const [{total: totalOrderMoney}] = await db.sequelize.query(`select sum(total) as total from Orders`, {type: QueryTypes.SELECT});
    const [{total:totalProductSold}] = await db.sequelize.query(`select sum(amount) as total from Order_items`, {type: QueryTypes.SELECT})
    res.render('admin/dashboard', {totalProduct  , totalOrder, totalOrderMoney, totalProductSold});
});
router.get('/products', async (req, res) => {
    if(req.query.search){
        const books = await db.Book.findAll({where:{
            title:{[Op.like]: `%${req.query.search}%`}
            }})
        return  res.render('admin/product', { books: books });
    }
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

 router.get("/orders", async(req,res)=>{
    // const orders = await db.Order.findAll();

     const orders = await db.sequelize.query(
         `select * from orders 
          inner join order_items 
            on order.id = order_items.order_id
         
    `, {type })
     res.render('admin/order', { orders })
 })

router.put('/orders/:id/update', checkAuthorization, async (req, res) =>{
    try {
        const { id } = req.body;
        await db.Order.update({ status : 1}, { where :{ id }});
        res.status(200).json({ msg:"Update success"});
    }catch (e) {
        res.status(500).json({ msg:"Internal error"})
    }
})
module.exports = router;