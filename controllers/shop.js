const Product = require("../models/product");
const Cart = require("../models/cart");

// Renders view-products view
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
		.then(([rows, FieldData]) => {
			res.render("shop/view-products", {
				prods: rows,
				docTitle: "All Products",
				path: "/products",
				hasProducts: rows.length > 0,
			});
		})
		.catch((err) => console.log(err));
};

// Renders product-details view
exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  // console.log(prodId);
  Product.findById(prodId, product => {
    res.render("shop/product-details", {
      product: product,
      docTitle: product.title,
      path: "/products",
    });
  });
}

// Renders index view for home
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
		.then(([rows, FieldData]) => {
			res.render("shop/view-products", {
				prods: rows,
				docTitle: "All Products",
				path: "/",
				hasProducts: rows.length > 0,
			});
		})
		.catch((err) => console.log(err));
};

// Renders cart view
exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: cartProducts,
        hasProducts: cartProducts.length > 0,
      });
    });
  });
}

// Controller to post items to the cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
}

// Controller to delete items from the cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
}

// Renders Order View
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};

// Renders Checkout View
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};