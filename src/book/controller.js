
const bookService = require("./service");
const categoryService = require('../category/categoryService');
class BookController {
 index = async (req, res) =>{
     const categories = await categoryService.findAll();
     const pages = 4
     if(req.query.search){
         const books = await bookService.searchByTitle(req.query.search)
         return  res.render('books/home', { books, categories });
     }
     if(req.query.category){
        const books = await bookService.searchByCategory(req.query.category)
        return  res.render('books/home', { books, categories});
     }
     const books = await bookService.findAll();
     res.render('books/home', { books, categories, pages});
 }
 bookDetail = async (req, res) => {
     const book = await bookService.findById(req.params.id);
     res.render('books/view', { book });
 }

}
module.exports = new BookController();