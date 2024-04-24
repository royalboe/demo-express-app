const Product = require("../models/product");

// Renders the add product view to give product details
exports.addProducts = (req, res, next) => {
	res.render("admin/add-product", {
		docTitle: "Add Product",
		path: "/admin/add-product",
	});
};

// Controller method to get product details from view and make a product object and redirects to home
exports.postProducts = (req, res, next) => {
	const title = req.body.title;
	const imageURL = req.body.imageURL;
	const price = req.body.price;
	const description = req.body.description;

	Product.create({
		title: title,
		imageURL: imageURL,
		price: price,
		description: description
	})
		.then((result) => {
			console.log("Product created");
			console.log(result)
		})
		.catch(err => console.log(err));
};

// To edit a single product
exports.editProduct = (req, res, next) => {
	const editMode = req.query.edit
	if (!editMode) {
		return res.redirect("/admin/products");
	}
	const productId = req.params.productId;
	Product.findById(productId, (product) => {
		if (!product) {
			return res.redirect("/admin/products");
		}
		res.render("admin/edit-product", {
			docTitle: "Edit Product",
			path: "/admin/edit-product",
			editing: editMode,
			product: product,
		});
	});
};

// Controller to render the admin product page
exports.getProducts = (req, res, next) => {
	Product.findAll().then((products) => {
		res.render("admin/products", {
			prods: products,
			docTitle: "Admin Products",
			path: "/admin/products",
			hasProducts: products.length > 0,
		});
	}).catch(err => console.log(err));
};


exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedImageURL = req.body.imageURL;
	const updatedPrice = req.body.price;
	const updatedDescription = req.body.description;
	const updatedProduct = new Product(
		productId,
		updatedTitle,
		updatedImageURL,
		updatedDescription,
		updatedPrice
	);
	console.log(updatedProduct);
	updatedProduct.save();
	res.redirect("/admin/products");
}

exports.deleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.deleteById(productId);
	res.redirect("/admin/products");
}
