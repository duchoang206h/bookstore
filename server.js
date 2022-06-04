require('dotenv').config();
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('./auth/passport');
const connectDB = require('./config/db');
const flash = require('connect-flash');
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
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
	res.locals.s_m = req.flash('success');
	res.locals.e_m = req.flash('error');
	next();
});

app.get('/', (req, res) => {
	res.redirect('/books');
});

app.use('/books', require('./routes/books'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./auth/auth.router'));
app.use('/admin', require('./routes/admin'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.IP, () => {
	console.log(`Server started on port ${PORT} on ${process.env.NODE_ENV} mode`);
});
