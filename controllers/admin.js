const Product = require("../models/product");

// Renders the add product view to give product details
exports.addProducts = (req, res, next) => {
	res.render("admin/add-product", {
		docTitle: "Add Product",
		path: "/admin/add-product",
		// isAuthenticated: req.session.user ? req.session.user.isLoggedIn : false,
	});
};

// Controller method to get product details from view and make a product object and redirects to home
exports.postProducts = (req, res, next) => {
	const title = req.body.title;
	const imageURL = req.body.imageURL;
	const price = req.body.price;
	const description = req.body.description;
	const userId = req.user._id;

	// Create a product to save
	const product = new Product({
		title: title,
		price,
		imageURL,
		description,
		userId,
	});
	product
		.save()
		.then(() => console.log("Inserted"))
		.then(() => res.redirect("/admin/products"))
		.catch((err) => console.log(err));
};

// To edit a single product
exports.editProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/admin/products");
	}
	const productId = req.params.productId;
	Product.findById(productId).then((product) => {
		res.render("admin/edit-product", {
			docTitle: "Edit Product",
			path: "/admin/edit-product",
			editing: editMode,
			product: product,
			// isAuthenticated: req.session.user ? req.session.user.isLoggedIn : false,
		});
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
			console.log(products);
			res.render("admin/products", {
				prods: products,
				docTitle: "Admin Products",
				path: "/admin/products",
				hasProducts: products.length > 0,
				// isAuthenticated: req.session.user ? req.session.user.isLoggedIn : false,
			});
		})
		.catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedImageURL = req.body.imageURL;
	const updatedPrice = req.body.price;
	const updatedDescription = req.body.description;
	const userId = req.user._id;
	Product.findById(productId)
		.then((product) => {
			if (userId.toString() !== product.userId.toString()) {
				return res.redirect("/");
			}
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDescription;
			product.imageURL = updatedImageURL;
			return product.save().then(() => {
				console.log("Product updated");
				res.redirect("/admin/products");
			});
		})
		.catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.deleteOne({ _id: productId, userId: req.user._id })
		.then(() => {
			res.redirect("/admin/products");
			console.log("Product deleted");
		})
		.catch((err) => console.log(err));
};
