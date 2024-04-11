const Product = require('../models/product');

exports.addProducts = (req, res, next) =>
{
  res.render("add-product", {
    docTitle: "Add Product",
    path: "/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postProducts = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save()
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop", {
    prods: products,
    docTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
    });
  }); 
};