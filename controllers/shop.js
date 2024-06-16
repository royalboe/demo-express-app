const Product = require("../models/product");
const Order = require("../models/orders");

// Renders view-products view
exports.getProducts = (req, res, next) => {
	Product.find()
		// .fetchAll()
		.then((products) => {
			res.render("shop/view-products", {
				prods: products,
				docTitle: "All Products",
				path: "/products",
				hasProducts: products.length > 0,
				isAuthenticated: req.session.user ? req.session.user.isLoggedIn : false,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Renders product-details view
exports.getProductDetails = (req, res, next) => {
	const prodId = req.params.productId;
	// Using the builtin findById mongoose method
	Product.findById(prodId)
		.then((product) => {
			res.render("shop/product-details", {
				product: product,
				docTitle: product.title,
				path: "/products",
				isAuthenticated: req.session.user ? req.session.user.isLoggedIn : false,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Renders index view for home
exports.getIndex = (req, res, next) => {
	// Fetches all products from the database
	Product.find()
		// .fetchAll()
		.then((products) => {
			res.render("shop/index", {
				prods: products,
				docTitle: "Shop",
				path: "/",
				hasProducts: products.length > 0,
				// isAuthenticated: req.session.user ? req.session.user.isLoggedIn : false,
				// csrfToken: req.csrfToken(),
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Renders cart view
exports.getCart = (req, res, next) => {
	req.user
		.populate("cart.items.productId")
		.then((user) => {
			const products = user.cart.items;
			res.render("shop/cart", {
				path: "/cart",
				docTitle: "Your Cart",
				hasProducts: products.length > 0,
				products: products,
				// isAuthenticated: req.session.user ? req.session.user.isLoggedIn : false,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Controller to post items to the cart
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then(() => {
			res.redirect("/cart");
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Controller to delete items from the cart
exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.deleteFromCart(prodId)
		.then(() => {
			res.redirect("/cart");
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Post Orders
exports.postOrder = (req, res, next) => {
	req.user
		.populate("cart.items.productId")
		.then((user) => {
			const products = user.cart.items.map((i) => {
				return {
					product: { ...i.productId._doc },
					quantity: i.quantity,
				};
			});
			const order = new Order({
				user: {
					email: user.email,
					userId: user,
				},
				items: products,
			});
			return order.save();
		})
		.then(() => {
			req.user.clearCartItems();
		})
		.then(() => res.redirect("/orders"))
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// Renders Order View
exports.getOrders = (req, res, next) => {
	Order.find({ "user.userId": req.user._id })
		.then((orders) => {
			res.render("shop/orders", {
				path: "/orders",
				docTitle: "Your Orders",
				orders: orders,
				// isAuthenticated: req.session.user ? req.session.user.isLoggedIn : false,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

// post reset cart
exports.postResetCart = (req, res, next) => {
	req.user
		.clearCartItems()
		.then(() => res.redirect("/"))
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
// // Renders Checkout View
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };