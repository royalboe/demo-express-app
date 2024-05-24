const User = require("../models/users");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
	// if (req.session.user) {
	// 	return res.redirect("/");
	// }
	
	let errorMessage = req.flash("error");
	if (errorMessage.length > 0) {
		errorMessage = errorMessage[0];
	} else {
		errorMessage = null;
	}
	// To get the login page
	res.render("auth/login", {
		path: "/login",
		docTitle: "Login",
		errorMessage
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	console.log(email);
	const password = req.body.password;
	console.log(password);
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash("error", "Invalid email or password.");
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
					req.flash("error", "Invalid email or password.");
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
	let errorMessage = req.flash("error");
	if (errorMessage.length > 0) {
		errorMessage = errorMessage[0];
	} else {
		errorMessage = null;
	}
	res.render("auth/signup", {
		path: "/signup",
		docTitle: "Signup",
		errorMessage,
	});
};

exports.addUser = (req, res, next) => {
	const email = req.body.email;
	const fullname = req.body.fullname;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	console.log(email, fullname, password, confirmPassword);

	if (password !== confirmPassword) {
		req.flash("error", "Please confirm your password.");
		return res.redirect("/signup");
	}

	User.findOne({ email: email })
		.then((userdoc) => {
			if (userdoc) {
				req.flash("error", "E-mail exists, kindly pick a new one");
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
