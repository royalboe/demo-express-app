const express = require('express');
const authController = require("../controllers/auth");
const { check, body } = require("express-validator");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
	"/signup",
  [
    check("email")
		.isEmail()
		.withMessage("Please enter a valid email address")
		.custom((value, { req }) => {
			if (value === "testtwo@test.com") {
				throw new Error("This email address is forbidden");
      }
      return true;
    }),
    body("password", "Password must be at least 6 characters long")
      .isLength({ min: 8 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],
	authController.addUser
);

router.get("/reset", authController.getResetPage);

router.post("/reset", authController.postResetPage);

router.get("/reset:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;