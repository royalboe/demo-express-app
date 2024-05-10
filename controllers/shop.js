const Product = require("../models/product");
// const Cart = require("../models/cart");

// Renders view-products view
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/view-products", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
        hasProducts: products.length > 0,
    });
  }).catch((err) => console.log(err));
};

// Renders product-details view
exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render("shop/product-details", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
  })
    .catch(err => console.log(err));
//   Product.findAll({where: {id: prodId}})
//     .then((product) => {
//       res.render("shop/product-details", {
//         product: product[0],
//         docTitle: product[0].title,
//         path: "/products",
//       });
//     }).catch(err => console.log(err));  
}

// Renders index view for home
exports.getIndex = (req, res, next) => {
  // Fetches all products from the database
  Product.fetchAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
      });
    })
    .catch((err) => console.log(err));
};

// Renders cart view
exports.getCart = (req, res, next) => {
	req.user
		.getCart()
		.then((products) => {
			res.render("shop/cart", {
				path: "/cart",
				docTitle: "Your Cart",
				hasProducts: products.length > 0,
				products: products,
			});
		})
		.catch((err) => console.log(err));
};

// Controller to post items to the cart
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findByPk(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			console.log(result);
			res.redirect("/cart");
		});
};

// Controller to delete items from the cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteFromCart(prodId)
		.then((result) => {
			res.redirect("/cart");
		})
		.catch((err) => console.log(err));
}

// Post Orders
exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
}

// Renders Order View
exports.getOrders = (req, res, next) => {
	req.user
		.getOrders()
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				docTitle: 'Your Orders',
        orders: orders
			});
		})
		.catch(err => console.log(err));
};

// // Renders Checkout View
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };