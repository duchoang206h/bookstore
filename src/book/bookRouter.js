const express = require('express');
const router = express.Router();
const bookController = require('./bookController')
const bookService = require('./bookService');
const categoryService = require('../category/categoryService');
router.get('/', bookController.index);

router.get('/view/:id', bookController.bookDetail);

module.exports = router;