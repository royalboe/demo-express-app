const Product = require("../models/product");
const Cart = require("../models/cart");

// Renders view-products view
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/view-products", {
    prods: products,
    docTitle: "All Products",
    path: "/products",
    hasProducts: products.length > 0,
    });
  }); 
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
  Product.fetchAll(products => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
    });
  });
};

// Renders cart view
exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "Your Cart",
    path: "/cart",
  });
};

// 
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
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