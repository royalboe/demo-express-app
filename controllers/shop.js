const Product = require("../models/product");
const Order = require("../models/orders");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

const ITEMS_PER_PAGE = 1;

// Renders view-products view
exports.getProducts = (req, res, next) => {
	// Get the current page
	const page = +req.query.page || 1;
	let totalItems;

	Product.find()
		.countDocuments()
		.then((numProducts) => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then((products) => {
			res.render("shop/products", {
				prods: products,
				docTitle: "Products",
				path: "/products",
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
	// Get the current page
	const page = +req.query.page || 1;
	let totalItems;

	Product.find()
		.countDocuments()
		.then((numProducts) => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then((products) => {
			res.render("shop/index", {
				prods: products,
				docTitle: "Shop",
				path: "/",
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

// To generate Invoice
exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;

	Order.findById(orderId)
		.then((order) => {
			if (!order) {
				return next(new Error("No roder found"));
			}
			if (order.user.userId.toString() !== req.user._id.toString()) {
				return next(new Error("Not Authorized"));
			}

			const products = order.items;
			console.log(products);
			const invoiceName = "invoice-" + orderId + ".pdf";
			const invoicePath = path.join("data", "invoices", invoiceName);

			//set headers
			res.setHeader("Content-type", "application/pdf");
			res.setHeader(
				"Content-disposition",
				'inline; filename="' + invoiceName + '"'
			);

			//this code create a PDF file on the fly
			const pdfDoc = new PDFDocument();
			pdfDoc.pipe(fs.createWriteStream(invoicePath));
			pdfDoc.pipe(res);
			pdfDoc.fontSize(30).text("INVOICE", 20, 30);
			pdfDoc.fontSize(30).text("LOGO", 20, 30, { align: "right" });
			pdfDoc.text("_______________________________");
			pdfDoc.text(" ");
			pdfDoc.fontSize(14).text("Invoice# " + order._id, 20, 110);
			pdfDoc
				.fontSize(14)
				.text("Invoice Date: " + new Date(Date.now()).toDateString());
			pdfDoc.fontSize(14).text(`Invoice To: ${order.user.email} `);
			pdfDoc.fontSize(30).text("_______________________________", 20, 140);
			pdfDoc.fontSize(14).text(" ");

			pdfDoc
				.fontSize(16)
				.text(
					"   ITEM                  DESCRIPTION                       Qty               AMOUNT",
					20,
					175
				);

			pdfDoc.fontSize(30).text("_______________________________", 20, 170);
			let totalPrice = 0;
			let item = 1;
			const fsize = 14;
			const ystart = 210;
			const xstart = 40;
			const yinc = fsize + 20;
			let ycoord = ystart + (item - 1) * yinc;

			// products.forEach(prod => {
			order.items.forEach((prod) => {
				console.log(prod);
				totalPrice += prod.quantity * prod.product.price;
				console.log(totalPrice);
				pdfDoc.fontSize(fsize).text(" " + item, xstart, ycoord);
				pdfDoc.fontSize(fsize).text(prod.product.title, xstart + 120, ycoord);
				pdfDoc.fontSize(fsize).text(prod.quantity, xstart + 330, ycoord);
				pdfDoc.fontSize(fsize).text(prod.product.price, xstart + 430, ycoord);
				item++;
				ycoord = ystart + (item - 1) * fsize;
			});

			pdfDoc.fontSize(30).text("_______________________________", 20, ycoord);
			pdfDoc.fontSize(20).text(" Total: $" + totalPrice, 400, ycoord + 40);
			pdfDoc
				.fontSize(30)
				.text("_______________________________", 20, ycoord + 40);

			console.log("About to close the stream!");
			pdfDoc.end();
			console.log("Stream closed");
		})
		.catch((err) => next(err));
};
// // Renders Checkout View
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };
