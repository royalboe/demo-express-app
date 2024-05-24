const express = require('express');
const session = require("express-session");
const MongoDbStore = require('connect-mongodb-session')(session);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const csrf = require('csurf');
const flash = require('connect-flash');

// const { google } = require("googleapis");
const dotenv = require('dotenv');


const isAuth = require("./middleware/is-auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/404");
const User = require("./models/users");

dotenv.config();

const MONGODB_URI = require("./util/database").MONGODB_URI;

const app = express();

// To connect the app engine to use handbar to parse to html code
// This configures the hbs
// app.engine(
//     'hbs',
//     expressHbs({
//         layoutsDir: 'views/layouts/',
//         defaultLayout: 'main-layout',
//         extname: 'hbs'
//     })
// )

// Lets us set any value golbally on our express application
// app.set('view engine', 'pug'); // set view engine to pug
// app.set('view engine', 'hbs') // Set view engine to hbs
app.set("view engine", "ejs"); // Set view engine to ejs
app.set("views", "views");

// To get access to the public folder and link static files like css
app.use(express.static(path.join(__dirname, "public")));

// This allows you to access form data submitted in POST requests via req.body in your route handlers
app.use(bodyParser.urlencoded({ extended: false }));

// Store session in database
const store = new MongoDbStore({
	uri: MONGODB_URI,
	collection: 'sessions'
})
// This is the middleware for the express-session
app.use(
	session({
		secret: "My Secret Name Shop App",
		resave: false,
		saveUninitialized: true,
		store:store
	})
);

app.use(csrf());

// Flash error message
app.use(flash());

// This is to register the user
app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user.user._id)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
});

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.user ? req.session.user.isLoggedIn : false;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use("/admin", isAuth, adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use(errorController.error);

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log("Connected");
		app.listen(3000);
	})
	.catch((err) => console.log(err));