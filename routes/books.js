const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
// const checkAuthentication = require('../middleware/checkAuthentication');
const checkAuthorization = require('../middleware/checkAuthorization');
const db = require('../models');

router.get('/',  async(req, res) => {
    const categories = await db.Category.findAll();
    
    if(req.query.search){
        const books = await db.Book.findAll({
            where:{
                title:{
                    [Op.like]: `%${req.query.search}%`
                }
            }
        });
       return  res.render('books/home', {books: books, categories});
    }
    const books = await db.Book.findAll();
    res.render('books/home', {books: books, categories});
    
    
    

});

router.get('/view/:id', async (req, res)=>{
    const book = await db.Book.findByPk(req.params.id);
    res.render('books/view', { book});
});

module.exports = router;