const express = require('express');

const { body, check } = require("express-validator");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET Method
router.get("/add-product", adminController.addProducts);

// /admin/products => GET Method
router.get("/products", adminController.getProducts);

// /admin/add-product => POST Method
router.post(
	"/add-product",
	[
		body("title").isString().isLength({ min: 3 }).trim(),
		check("image")
			.custom((value, { req }) => {
				if (
					req.file.mimetype === "image/png" ||
					req.file.mimetype === "image/jpg" ||
					req.file.mimetype === "image/jpeg"
				) {
					return ".jpg/.png/.jpeg";
				} else {
					return false;
				}
			})
			.withMessage("Please submit a jpg, jpeg or png image file, thank you"),
		body("price").isFloat(),
		body("description").isLength({ min: 10, max: 400 }).trim(),
	],
	adminController.postProducts
);

// /admin/edit-product/:productId => GET Method
router.get('/edit-product/:productId', adminController.editProduct);

// /admin/edit-product => POST Method
router.post(
	"/edit-product",
	[
		body("title").isString().isLength({ min: 3 }).trim(),
		// check("image")
		// 	.custom((value, { req }) => {
		// 		if (
		// 			req.file.mimetype === "image/png" ||
		// 			req.file.mimetype === "image/jpg" ||
		// 			req.file.mimetype === "image/jpeg"
		// 		) {
		// 			return ".jpg/.png/.jpeg";
		// 		} else {
		// 			return false;
		// 		}
		// 	})
		// 	.withMessage("Please submit a jpg, jpeg or png image file, thank you"),
		body("price").isFloat(),
		body("description").isLength({ min: 10, max: 400 }).trim(),
	],
	adminController.postEditProduct
);

// /admin/delete-product => POST Method
router.delete('/product/:productId', adminController.deleteProduct);

// router.post('/add-user', adminController.addUser);

module.exports = router;
