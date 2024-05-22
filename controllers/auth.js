const User = require('../models/users')

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').trim().split('=')[1];
  res.render("auth/login", {
		path: "/login",
		docTitle: "Login",
		isAuthenticated: req.session.user ? req.session.user.isLoggedIn : false
	});
};

exports.postLogin = (req, res, next) => {
	User.findById("66492d78a65d7290a037cd9c")
		.then((user) => {
			req.session.user = {
				user: user,
				isLoggedIn: true,
			};
			req.session.save((err) => {
				if (err) {
					console.log(err);
					return next(err); // Handle error appropriately
				}
				res.redirect("/login");
			});
		})
		.catch((err) => {
			console.log(err);
			next(err); // Handle error appropriately
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err);
			return next(err); // Handle error appropriately
		}
		res.redirect("/login");
	});
};

// To get the sign up page
exports.getSignup = (req, res, next) => {
	res.render("auth/signup", {
		path: "/signup",
		docTitle: "Signup",
		isAuthenticated: false,
	});
};

exports.addUser = (req, res, next) => {
	const email = req.body.email;
	const fullname = req.body.fullname;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	if (password !== confirmPassword) {
		return res.redirect("/signup");
	}

	User.findOne({ email: email })
		.then((userdoc) => {
			if (userdoc) {
				return res.redirect("/signup");
			}
			const user = new User({
				fullname,
				email,
				password,
				cart: { items: [] },
				created: new Date(),
			});

			console.log(email, fullname, password);
			return user.save();
		})
		.then(() => {
			console.log("Inserted user");
			res.redirect("/login");
		})
		.catch((err) => console.log(err));
};
