require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('./auth/passport');
const connectDB = require('./config/db');
const db = require('./models');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const helmet = require('helmet');
const rateLimit = require('./middleware/rateLimit')
const logger = require('morgan')


// Set csp config
app.use(function (req, res, next) {
	res.setHeader(
		'Content-Security-Policy',
		"frame-ancestors 'self'; default-src *; style-src * 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'; img-src 'self' blob: data:;"
	);
	next();
});


//Monitor
app.use(require('express-status-monitor')());
/* app.use(logger()); */
/* app.use(helmet()); */
app.use(rateLimit)
app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: process.env.SESSION_SECRET,
		cookie: {
		  path: "/",
		  httpOnly: true,
		  maxAge: 3600 * 1000 * 24 * 365 * 10,
		},
		store: new SequelizeStore({
			db: db.sequelize
		})
	})
);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
 	res.redirect('/books');
});

app.use('/books', require('./book/router'));
app.use('/users', require('./user/router'));
app.use('/auth', require('./auth/router'));
app.use('/admin', require('./admin/router'));
app.use('/payment', require('./payment/router'));
app.use('/', (req, res) => res.redirect('/books'));

module.exports = app;