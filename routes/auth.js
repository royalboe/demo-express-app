const express = require('express');
const authController = require("../controllers/auth");
const User = require("../models/users");
const { check, body } = require("express-validator");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
	"/login",
	[
		body("email")
			.isEmail()
			.withMessage("Please enter a valid email")
			.normalizeEmail(),
		body("password", "Password must be at least 6 characters long")
			.trim()
			.isLength({ min: 8 })
			.isAlphanumeric()
			.withMessage("Password must be alphanumeric"),
	],
	authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
	"/signup",
	[
		check("email")
			.isEmail()
			.withMessage("Please enter a valid email address")
			.normalizeEmail()
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject("E-mail exists, kindly pick a new one");
					}
				});
			}),
		body("password", "Password must be at least 6 characters long")
			.trim()
			.isLength({ min: 8 })
			.isAlphanumeric()
			.withMessage("Password must be alphanumeric"),
		body("confirmPassword")
			.trim()
			.notEmpty()
			.withMessage("Please confirm your password")
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error("Passwords do not match");
				}
				return true;
			}),
		check("fullname", "Please enter a valid name")
			.notEmpty()
			.withMessage("Please enter your fullname")
			.trim()
			.isLength({ min: 3 })
			.withMessage("Please enter a valid fullname"),
	],
	authController.addUser
);

router.get("/reset", authController.getResetPage);

router.post("/reset", authController.postResetPage);

router.get("/reset:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;