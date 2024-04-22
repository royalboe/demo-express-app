const db = require('../util/database');

const Cart = require('./cart');


// Product model class
module.exports = class Product {
	// Constructor to instantiate products
	constructor(id, title, imageURL, description, price) {
		this.id = id;
		this.title = title;
		this.imageURL = imageURL;
		this.description = description;
		this.price = price;
  }

	// Method to save the product
	save() { }

	// Static method to delete product by id
	static deleteById(id) {
	}
	// Static method to return products
	static fetchAll() {
		return db.execute('SELECT * FROM products');
	}

	// Static method to find product by id
	static findById(id, cb) {}
};