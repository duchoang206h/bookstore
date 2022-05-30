const categoryService = require("../category/categoryService");
const bookService = require("./bookService");
const {mode} = require("mongoose/webpack.base.config");

const bookService = require('./bookService');
const categoryService = require('../category/categoryService');
class BookController {
 index = async (req, res) =>{
     const categories = await categoryService.findAll();
     if(req.query.search){
         const books = await bookService.searchByTitle(req.query.search)
         return  res.render('books/home', {books, categories});
     }
     const books = await bookService.findAll();
     res.render('books/home', { books, categories});
 }
 bookDetail = async (req, res) => {
     const book = await bookService.findById(req.params.id);
     res.render('books/view', { book });
 }

}
module.exports = new BookController();