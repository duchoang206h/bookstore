const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const checkAuthentication = require('../middleware/checkAuthentication');
const db = require('../models');
const { QueryTypes } = require('sequelize');
const formatPrice = require('../helper/formatPrice')
// Get R oute For Register
router.get('/register', (req, res) => {
	res.render('users/register');
});

// Post Route For Users Reister
router.post('/register', async (req, res) => {
	const foundDuplicate = async (email) => {
		try {
			const duplicate = await User.findOne({ email: email });
			if (duplicate) return true;
			return false;
		} catch (e) {
			console.log(e);
			return false;
		}
	};
	const errors = [];
	const nameRagex = /^[a-zA-Z ]*$/;
	const emailRagex =
		/^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
	const newUser = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	};
	if (!nameRagex.test(newUser.name)) {
		errors.push({
			msg: `Name doesn't Contain any number or a special Charecter.`,
		});
	}
	if (!emailRagex.test(newUser.email)) {
		errors.push({
			msg: `Email is not Valid. Please enter a valid Email.`,
		});
	}
	if (newUser.password.length < 6) {
		errors.push({
			msg: `Password must contain atleast 6 Characters`,
		});
	}
	if (await foundDuplicate(newUser.email)) {
		errors.push({
			msg: `Email is already Registered`,
		});
	}
	if (errors.length > 0) {
		res.render('users/register', { errors: errors, newUser: newUser });
	} else {
		try {
			const hashedPassword = await bcrypt.hash(newUser.password, 10);
			try {
				const savedUser = new User({
					name: newUser.name,
					email: newUser.email,
					password: hashedPassword,
				});
				await savedUser.save();
				// Mail Options
				const msg = `
                        <h2 style="color: rgb(90, 10, 219); text-transform: capitalize;">Hello, ${savedUser.name}</h2>
                        <h4 style="font-style: italic;">You are now a Customer of our <strong>BOOK STORE</strong></h4>
                        <h2>Your Password: <span style="color: red; font-size: 25px;">${newUser.password}</span></h2>  
                        <p>You can now login and shopinng with us!!</p>
                        

                        <h5>Thank you</h5>
                        <h6>Admin, Book Store</h6>
                        <img src="https://cdn3.iconfinder.com/data/icons/book-shop-category-ouline/512/Book_Shop_Category-10-512.png" alt="" style="height: 3em; width: 3em; border-radius: 50%">
                        `;
				sgMail.setApiKey(require('../config/keys').sendGridKey);
				const mail = {
					to: savedUser.email,
					from: 'BOOK STORE <nilanjan1729reso@gmail.com>',
					subject: 'Register on BOOK STORE',
					text: 'Welcome to BOOK STORE',
					html: msg,
				};
				sgMail.send(mail);
				req.flash('success', 'You are now Registered. Password is sent to your email');
				res.redirect('/users/login');
			} catch (e) {
				res.render('users/register', {
					errors: { msg: 'Internal Server Error' },
					newUser: newUser,
				});
			}
		} catch (e) {
			res.render('users/register', { errors: { msg: 'Internal Server Error' }, newUser: newUser });
		}
	}
});

// Users Login Route
router.get('/login', (req, res) => {
	if(req.user){
		if(req.session.user.role_id == 2) return res.redirect('/');
		else return res.redirect('/admin');
	}
	else{
		return res.render('users/login')
	}
});

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

router.get('/logout', (req, res) => {
	req.logOut();
	res.redirect('/books');
});

// Cart Route
router.put('/cart',checkAuthentication, async (req, res) => {
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
router.delete('/cart', checkAuthentication, async (req, res) => {
	try {
		
	} catch (e) {
		
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
		console.log(total)
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
