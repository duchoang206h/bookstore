const express = require('express');
const router = express.Router();
const bookController = require('./controller')
const bookService = require('./service');
const categoryService = require('../category/categoryService');
router.get('/', bookController.index);

router.get('/view/:id', bookController.bookDetail);

module.exports = router;