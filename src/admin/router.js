const express = require('express');
const router = express.Router();
const checkAuthorization = require('../middleware/checkAuthorization');
const adminController = require('./controller')
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

router.get('/', checkAuthorization, adminController.index );
router.get('/products', checkAuthorization, adminController.getProducts);
router.get('/products/:id/edit', checkAuthorization, adminController.getProductEdit);

router.put('/products/:id/edit/image', checkAuthorization, upload.single('image'), adminController.updateProductImage);
router.put('/products/:id/edit', checkAuthorization, adminController.updateProduct);
router.delete('/products/:id/delete', checkAuthorization ,adminController.deleteProduct);

 router.get('/products/create',checkAuthorization, adminController.getCreateProduct);
 router.post('/products/create',checkAuthorization ,adminController.createProduct);


 router.get("/orders",checkAuthorization, adminController.getOrders)

router.put('/orders/:id/update', checkAuthorization, adminController.updateOrder)
module.exports = router;