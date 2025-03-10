const express = require('express');
const session = require("express-session");
const MongoDbStore = require('connect-mongodb-session')(session);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const csrf = require('csurf');
const flash = require('connect-flash');

// const { google } = require("googleapis");
// To get environment variables from .env file
const dotenv = require('dotenv');


const isAuth = require("./middleware/is-auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const User = require("./models/users");

// Initiate environment variables
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
app.use('/public/uploads', express.static(path.join(__dirname, "public/uploads")));
// app.use('/images/', express.static(path.join(__dirname, "images")));

// This allows you to access form data <Text format> submitted in POST requests via req.body in your route handlers
app.use(bodyParser.urlencoded({ extended: false }));

// Storage engine for multer
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		// cb(null, "images");
		cb(null, "./public/uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

// Function to filter by file type
const fileFilter = (req, file, cb) => {
	console.log(file.mimetype);
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

// This allows you access files from forms.=, the .single function is to select the file name
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

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

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.user
		? req.session.user.isLoggedIn
		: false;
	res.locals.csrfToken = req.csrfToken();
	next();
});

// This is to register the user
app.use((req, res, next) => {
	// throw new Error('Sync Dummy');
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user.user._id)
		.then((user) => {
			// throw new Error("Sync Dummy");
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			next(new Error(err));
			console.log(err);
			// throw new Error(err);
		});
});

app.use("/admin", isAuth, adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
	// res.redirect("/500");
	console.log(error);
	res.status(500).render("500", {
		docTitle: "Error",
		path: "/500",
	});
});


mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log("Connected");
		app.listen(3000);
	})
	.catch((err) => console.log(err));