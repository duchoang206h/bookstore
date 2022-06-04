require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('./auth/passport');
const connectDB = require('./config/db');
const db = require('./models');
const SequelizeStore = require("connect-session-sequelize")(session.Store);


app.use(
	session({
		resave: true,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.IP, () => {
	console.log(`Server started on port ${PORT} on ${process.env.NODE_ENV} mode`);
});
