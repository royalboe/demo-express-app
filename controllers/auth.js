const User = require("../models/users");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
	res.render("auth/login", {
		path: "/login",
		docTitle: "Login",
		errorMessage: req.flash("error"),
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash("error", "Invalid email or password");
				return res.redirect("/login");
			}
			bcrypt
				.compare(password, user.password)
				.then((isMatch) => {
					if (isMatch) {
						req.session.user = {
							user: user,
							isLoggedIn: true,
						};
						return req.session.save((err) => {
							if (err) {
								console.log(err);
								return next(err); // Handle error appropriately
							}
							res.redirect("/");
						});
					}
					res.redirect("/login");
				})
				.catch((err) => {
					console.log(err);
					req.flash("error", "Invalid email or password");
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
	console.log(email, fullname, password, confirmPassword);

	if (password !== confirmPassword) {
		return res.redirect("/signup");
	}

	User.findOne({ email: email })
		.then((userdoc) => {
			if (userdoc) {
				return res.redirect("/signup");
			}
			return bcrypt.hash(password, 12).then((hashedPassword) => {
				console.log(hashedPassword);
				const user = new User({
					fullname,
					email,
					password: hashedPassword,
					cart: { items: [] },
					created: new Date(),
				});
				return user.save();
			});
	})
		.then(() => {
			console.log("Inserted user");
			res.redirect("/login");
		})
		.catch((err) => console.log(err));
};
