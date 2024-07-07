const Product = require("../models/product");
const { validationResult } = require("express-validator");
const fileHelper = require("../util/file");


const ITEMS_PER_PAGE = 1;

// Renders the add product view to give product details
exports.addProducts = (req, res, next) => {
	res.render("admin/add-product", {
		docTitle: "Add Product",
		path: "/admin/add-product",
		errorMessage: "",
		validationErrors: [],
		product: {
			title: "",
			price: "",
			description: "",
		},
	});
};

// Controller method to get product details from view and make a product object and redirects to home
exports.postProducts = (req, res, next) => {
	const title = req.body.title;
	const image = req.file;
	const price = req.body.price;
	const description = req.body.description;
	const userId = req.user._id;
	const errors = validationResult(req);

	if (!image) {
		return res.status(422).render("admin/add-product", {
			docTitle: "Add Product",
			path: "/admin/add-product",
			errorMessage: "Attached file is not an image.",
			validationErrors: [],
			product: {
				title: title,
				price: price,
				description: description,
			},
		});
	}
	const imageURL = image.path;

	if (!errors.isEmpty()) {
		console.log('Errors found');
		return res.status(422).render("admin/add-product", {
			docTitle: "Add Product",
			path: "/admin/add-product",
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
			product: {
				title: title,
				price: price,
				description: description,
				userId,
			},
		});
		
	}
	
	// Create a product to save
	const product = new Product({
		title: title,
		price,
		imageURL: imageURL,
		description,
		userId,
	});
	product
		.save()
		.then(() => console.log("Inserted"))
		.then(() => res.redirect("/admin/products"))
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Get method To edit a single product
exports.editProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/admin/products");
	}
	const productId = req.params.productId;
	Product.findById(productId)
		.then((product) => {
			if (!product) {
				return res.redirect("/admin/products");
			}
		
		res.render("admin/edit-product", {
			docTitle: "Edit Product",
			path: "/admin/edit-product",
			editing: editMode,
			product: product,
			validationErrors: [],
			errorMessage: "",
		});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getAllProducts = (req, res, next) => {
	// Get the current page
	const page = +req.query.page || 1;
	let totalItems;

	Product.find({ userId: req.user._id })
		.countDocuments()
		.then((numProducts) => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				docTitle: "Admin Products",
				path: "/admin/products",
				hasProducts: products.length > 0,
				isNotPageOne: page !== 1 && page - 1 !== 1,
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
// Controller to render the admin product page
exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.user._id })
		// This will return all products and select fields to be returned
		// .select("title price -_id imageURL description")
		// This will populate the userId field with the username field
		// .populate("userId", "fullname", "email")
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				docTitle: "Admin Products",
				path: "/admin/products",
				hasProducts: products.length > 0,
				validationErrors: [],
				errorMessage: "",
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// To update the product in the db and display
exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedImage = req.file;
	const updatedPrice = req.body.price;
	const updatedDescription = req.body.description;
	const userId = req.user._id;

	console.log(updatedImage);

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log('Errors found');
		return res.status(422).render("admin/edit-product", {
			docTitle: "Edit Product",
			path: "/admin/edit-product",
			editing: true,
			product: {
				title: updatedTitle,
				price: updatedPrice,
				description: updatedDescription,
				_id: productId,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});		
	}

	Product.findById(productId)
		.then((product) => {
			if (userId.toString() !== product.userId.toString()) {
				return res.redirect("/");
			}
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDescription;
			if (updatedImage) {
				fileHelper.deleteFile(product.imageURL)
					.catch((err) => {
						console.log(err);
						next(new Error(err));
					});
				product.imageURL = updatedImage.path;
				console.log(product.imageURL);
			}
			return product.save().then(() => {
				console.log("Product updated");
				res.redirect("/admin/products");
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.deleteProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product.findById(productId)
		.then((product) => {
			if (!product) {
				return next(new Error("Product not found"));
			}
			fileHelper.deleteFile(product.imageURL);
			return Product.deleteOne({ _id: productId, userId: req.user._id });
		})
		.then(() => {
			res.status(200).json({message: 'Success'});
			console.log("Product deleted");
		})
		.catch((err) => {
			res.status(500).json({message: 'Deleting product failed'});
		});		
};
