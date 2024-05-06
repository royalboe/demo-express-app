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

	// Create a product to save
	const product = new Product(title, price, imageURL, description);
	product.save().then(() => res.redirect("/admin/products")).catch(err => console.log(err));

	// // Create a product object and save it to the database using the userId
	// req.user.createProduct({
	// 	title: title,
	// 	imageURL: imageURL,
	// 	price: price,
	// 	description: description,
	// })
	// //Product.create({ title: title, imageURL: imageURL, price: price, description: description, userId: req.user.id })
	// 	.then(() => {
	// 		res.redirect("/admin/products");
	// 	})
	// 	.catch(err => console.log(err));
};

// To edit a single product
exports.editProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/admin/products");
	}
	const productId = req.params.productId;
// 	req.user
// 		.getProducts({ where: {id: productId}})
	Product.findByPk(productId)
		.then(product => {
			// const product = products[0];
			// if (!product) {
			// 	return res.redirect("/admin/products");
			// }
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
	Product.fetchAll()
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				docTitle: "Admin Products",
				path: "/admin/products",
				hasProducts: products.length > 0,
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
	Product.findByPk(productId)
		.then(product => {
			product.title = updatedTitle;
			product.imageURL = updatedImageURL;
			product.description = updatedDescription;
			product.price = updatedPrice;
			product.save();
		})
		.then(() => {
			console.log("Product updated");
			res.redirect("/admin/products");
		})
		.catch((err) => console.log(err));
};

// exports.deleteProduct = (req, res, next) => {
// 	const productId = req.body.productId;
// 	Product.findByPk(productId)
// 		.then(product => {
// 			product.destroy();
// 		})
// 		.then(() => {
// 			res.redirect("/admin/products");
// 			console.log("Product deleted");
// 		})
// 		.catch(err => console.log(err));	
// }
