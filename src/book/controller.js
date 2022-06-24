
const bookService = require("./service");
const categoryService = require('../category/categoryService');
const { ITEMS_PER_PAGE } = require('../constants')
class BookController {
 index = async (req, res) =>{
     const categories = await categoryService.findAll();
     const countBook = await bookService.count();
     const pages = (countBook - Math.floor(countBook/ITEMS_PER_PAGE)*ITEMS_PER_PAGE) > 0 ? Math.floor(countBook/ITEMS_PER_PAGE)+1 :Math.floor(countBook/ITEMS_PER_PAGE)
     const page = req.query.page || 1;
     const skip = (page -1)* ITEMS_PER_PAGE;
     if(req.query.search){
         const books = await bookService.searchByTitle(req.query.search)
         return  res.render('books/home', { books, categories , pages});
     }
     if(req.query.category){
        const books = await bookService.searchByCategory(req.query.category)
        return  res.render('books/home', { books, categories, pages});
     }
     const books = await bookService.findAll({ limit: ITEMS_PER_PAGE, offset: skip});
     res.render('books/home', { books, categories, pages});
 }
 bookDetail = async (req, res) => {
     const book = await bookService.findById(req.params.id);
     res.render('books/view', { book });
 }

}
module.exports = new BookController();