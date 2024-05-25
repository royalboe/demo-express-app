const express = require('express');
const authController = require('../controllers/auth')

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.addUser);

router.get("/reset", authController.getResetPage);

router.post("/reset", authController.postResetPage);

router.get("/reset:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;