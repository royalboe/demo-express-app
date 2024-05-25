require("dotenv").config();
const crypto = require("crypto");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	},
});

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
		errorMessage,
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
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render("auth/signup", {
			path: "/signup",
			docTitle: "Signup",
			errorMessage: errors.array()[0].msg,
		});
	}
	console.log(email, fullname, password, confirmPassword);

	// make sure password is a match with confirm password
	if (password !== confirmPassword) {
		req.flash("error", "Please confirm your password.");
		return res.redirect("/signup");
	}

	// Check if user exists
	User.findOne({ email: email })
		.then((userdoc) => {
			if (userdoc) {
				req.flash("error", "E-mail exists, kindly pick a new one");
				return res.redirect("/signup");
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						fullname,
						email,
						password: hashedPassword,
						cart: { items: [] },
						created: new Date(),
					});
					return user.save();
				})
				.then(() => {
					console.log("Inserted user");
					res.redirect("/login");
					return transporter.sendMail({
						from: {
							name: "Shop App",
							address: process.env.EMAIL,
						},
						to: email,
						subject: "Signup succeeded!",
						html: "<h1>You successfully signed up!</h1>",
					});
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
};

// To get the Reset Password page
exports.getResetPage = (req, res, next) => {
	let errorMessage = req.flash("error");
	if (errorMessage.length > 0) {
		errorMessage = errorMessage[0];
	} else {
		errorMessage = null;
	}
	res.render("auth/reset", {
		path: "/reset",
		docTitle: "Reset Password",
		errorMessage,
	});
};

exports.postResetPage = (req, res, next) => {
	const email = req.body.email;
	console.log(email);
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect("/reset");
		}
		const token = buffer.toString("hex");
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					req.flash("error", "No account with that email found.");
					return res.redirect("/reset");
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
				return user.save();
			})
			.then(() => {
				res.redirect("/");
				transporter.sendMail({
					from: {
						name: "Shop App",
						address: process.env.EMAIL,
					},
					to: email,
					subject: "Password reset",
					html: `
						<p>You requested a password reset</p>
						<p>Click this <a href="http://localhost:3000/reset${token}">link</a> to set a new password.</p>
					`,
				});
			})
			.catch((err) => {
				console.log(err);
				next(err); // Handle error appropriately
			});
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
		.then((user) => {
			let errorMessage = req.flash("error");
			if (errorMessage.length > 0) {
				errorMessage = errorMessage[0];
			} else {
				errorMessage = null;
			}
			res.render("auth/new-password", {
				path: "/new-password",
				docTitle: "New Password",
				errorMessage,
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId,
	})
		.then((user) => {
			if (!user) {
				req.flash("error", "No user found");
				return res.redirect("/reset");
			}
			console.log(confirmPassword, newPassword);
			if (newPassword !== confirmPassword) {
				req.flash("error", "Passwords do not match");
				return res.redirect("/reset");
			}
			resetUser = user;
			return bcrypt.hash(newPassword, 12);
		})
		.then((hashedPassword) => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = undefined;
			resetUser.resetTokenExpiration = undefined;
			return resetUser.save();
		})
		.then(() => {
			res.redirect("/login");
			return transporter.sendMail({
				from: {
					name: "Shop App",
					address: process.env.EMAIL,
				},
				to: resetUser.email,
				subject: "Password reset successful",
				html: `
						<p>Password Reset Successful</p>
						<p>Click this <a href="http://localhost:3000/login">link</a> to login.</p>
					`,
			});
		})
		.catch((err) => console.log(err));
};
