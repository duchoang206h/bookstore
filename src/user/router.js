const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const checkAuthentication = require('../middleware/checkAuthentication');
const db = require('../models');
const { QueryTypes } = require('sequelize');
const userController = require('./controller')
// Users Login Route
router.get('/login', userController.getLogin);

// Users Login Post Route
router.post(
    '/login',
    passport.authenticate('local', {
        successFlash: true,
        successRedirect: '/users/dashboard',
        failureFlash: true,
        failureRedirect: '/users/login',
    }),

);

router.get('/logout', userController.logout);

// Cart Route
router.put('/cart', checkAuthentication, async (req, res) => {
    try {

        const [cart, created] = await db.Cart.findOrCreate({
            where: { user_id: req.session.user.id }});
        const cart_item = await db.Cart_item.findOne({where:{ cart_id: cart.id, book_id: req.body.id}});
        if(cart_item) await db.Cart_item.update({amount:cart_item.amount + req.body.amount}, { where:{id: cart_item.id}})
        else{
            await db.Cart_item.create({ amount: req.body.amount, book_id: req.body.id, cart_id: cart.id})
        }

        return res.status(200).json({})

    } catch (e) {
        console.log(e);

        return res.status(500).json({message: e})
    }
});
router.put('/cart/:id',checkAuthentication, async (req, res) => {
    try {

        if(await db.Cart_item.update({amount: req.body.amount}, { where:{id : req.params.id}})) {
            const total  = await db.sequelize.query(`
			select sum(Cart_items.amount*Books.price) as total from Books
				inner join Cart_items
					on Cart_items.book_id = Books.id
				where  Cart_items.cart_id in (
							select id from Carts where user_id = ? )`, {
                replacements: [req.session.user.id],
                type: QueryTypes.SELECT
            });
            return res.status(200).json({item: await db.Cart_item.findByPk(req.params.id), total: total[0].total });
        }else {
            return res.status(404).json({ item: null, total: 0})
        }
    } catch (e) {
        return res.status(500).json({message: e, item: null, total:0})
    }
});
// Delete Item
router.delete('/cart/cart_item/:id', checkAuthentication, async (req, res) => {
    try {
        await db.Cart_item.destroy({where:{id: req.params.id}});
        return res.status(200).json({message:"success"})
    } catch (e) {
        return res.status(500).json({message: e})
    }
});
// Dashboard
router.get('/cart', checkAuthentication, async (req, res) => {
    const cart_items  = await db.sequelize.query(`
			select Cart_items.id, Books.title, Books.price, Books.description, Cart_items.amount, Cart_items.amount*Books.price as total from Books
				inner join Cart_items
					on Cart_items.book_id = Books.id
				where  Cart_items.cart_id in (
							select id from Carts where user_id = ? )`, {
        replacements: [req.session.user.id],
        type: QueryTypes.SELECT
    });
    const total  = await db.sequelize.query(`
			select sum(Cart_items.amount*Books.price) as total from Books
				inner join Cart_items
					on Cart_items.book_id = Books.id
				where  Cart_items.cart_id in (
							select id from Carts where user_id = ? )`, {
        replacements: [req.session.user.id],
        type: QueryTypes.SELECT
    });
    res.render('users/cart', { cart_items, total: total[0].total })
});

router.get('/checkout', async (req, res) => {
    const cart_items  = await db.sequelize.query(`
			select Cart_items.id, Books.title, Books.price, Books.description, Cart_items.amount, Cart_items.amount*Books.price as total from Books
				inner join Cart_items
					on Cart_items.book_id = Books.id
				where  Cart_items.cart_id in (
							select id from Carts where user_id = ? )`, {
        replacements: [req.session.user.id],
        type: QueryTypes.SELECT
    });
    const total  = await db.sequelize.query(`
			select sum(Cart_items.amount*Books.price) as total from Books
				inner join Cart_items
					on Cart_items.book_id = Books.id
				where  Cart_items.cart_id in (
							select id from Carts where user_id = ? )`, {
        replacements: [req.session.user.id],
        type: QueryTypes.SELECT
    });

    res.render('users/checkout', { cart_items, total: total[0].total });

});

router.post('/order', async (req, res) => {
    try {
        const t = await db.sequelize.transaction();

        const total  = await db.sequelize.query(`
			select sum(Cart_items.amount*Books.price) as total from Books
				inner join Cart_items
					on Cart_items.book_id = Books.id
				where  Cart_items.cart_id in (
							select id from Carts where user_id = ? )`, {
                replacements: [req.session.user.id],
                type: QueryTypes.SELECT
            }
        );
        const order = await db.Order.create({ phone_number: req.body.phone_number, address: req.body.address,
                fullname: req.body.fullname, total: total[0].total, shipping: 0, user_id: req.session.user.id },
            { transaction: t}
        );

        const cart_items =  await db.sequelize.query(`
			select Books.id as book_id, Cart_items.amount, ${req.session.user.id} as user_id,  ${order.id} as order_id from Books
				inner join Cart_items
					on Cart_items.book_id = Books.id
				where  Cart_items.cart_id in (
							select id from Carts where user_id = ? )`, {
            replacements: [req.session.user.id],
            type: QueryTypes.SELECT
        });

        const order_items = await db.Order_item.bulkCreate(
            cart_items
            ,{ transaction: t});

        const transaction = await db.Transaction.create({ type:"cod", status: 1, user_id: req.session.user.id, order_id: order.id}, { transaction: t})
        await t.commit();
        console.log(order_items);
        res.send("KKKK");
    }catch (e) {
        await t.rollback();
        console.log(e)
    }

});

router.get('/orders', checkAuthentication, async (req, res) => {

});

module.exports = router;
