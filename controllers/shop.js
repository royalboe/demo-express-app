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
// exports.getCart = (req, res, next) => {
// 	req.user
// 		.getCart()
// 		.then((cart) => {
// 			return cart
// 				.getProducts()
// 				.then((products) => {
// 					res.render("shop/cart", {
// 						path: "/cart",
// 						docTitle: "Your Cart",
// 						hasProducts: products.length > 0,
// 						products: products,
// 					});
// 				})
// 				.catch((err) => console.log(err));
// 		})
// 		.catch((err) => console.log(err));
// };

// // Controller to post items to the cart
// exports.postCart = (req, res, next) => {
// 	const prodId = req.body.productId;
// 	let fetchedCart;
// 	let newQuantity = 1;
// 	req.user
// 		.getCart()
// 		.then((cart) => {
// 			fetchedCart = cart;
// 			return cart.getProducts({ where: { id: prodId } });
// 		})
// 		.then((products) => {
// 			let product;
// 			if (products.length > 0) {
// 				product = products[0];
// 			}

// 			if (product) {
// 				const oldQuantity = product.cartItem.quantity;
// 				newQuantity = oldQuantity + 1;
// 				return product;
// 			}
// 			return Product.findByPk(prodId);
// 		})
// 		.then((product) => {
// 			return fetchedCart.addProduct(product, {
// 				through: { quantity: newQuantity },
// 			});
// 		})
// 		.then(() => {
// 			res.redirect("/cart");
// 		})
// 		.catch((err) => console.log(err));
// };

// // Controller to delete items from the cart
// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
// 		.getCart()
// 		.then((cart) => {
// 			return cart.getProducts({ where: { id: prodId } });
// 		})
// 		.then((products) => {
// 			const product = products[0];
// 			return product.cartItem.destroy();
// 		})
// 		.then((result) => {
// 			res.redirect("/cart");
// 		})
// 		.catch((err) => console.log(err));
// }

// // Post Orders
// exports.postOrder = (req, res, next) => {
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user
//         .createOrder()
//         .then((order) => {
//           return order.addProducts(
//             products.map((product) => {
//               product.orderItem = { quantity: product.cartItem.quantity };
//               return product;
//             })
//           );
//         })
//         .catch((err) => console.log(err));
//     })
//     .then((result) => {
//       return fetchedCart.setProducts(null);
//     })
//     .then((result) => {
//       res.redirect("/orders");
//     })
//     .catch((err) => console.log(err));
// }

// // Renders Order View
// exports.getOrders = (req, res, next) => {
// 	req.user
// 		.getOrders({include: ['products']})
// 		.then(orders => {
// 			res.render('shop/orders', {
// 				path: '/orders',
// 				docTitle: 'Your Orders',
//         orders: orders
// 			});
// 		})
// 		.catch(err => console.log(err));
// };

// // Renders Checkout View
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };