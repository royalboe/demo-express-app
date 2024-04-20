const fs = require('fs');
const path = require('path');

const rootDir = require("../util/path");

const p = path.join(rootDir, 'data', 'products.json');

// Helper function to help retrieve product from file
const getProductsFromFIle = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent))
        }
    });
}

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
	save() {
		getProductsFromFIle((products) => {
			if (this.id) {
				const existingProductIndex = products.findIndex(prod => prod.id === this.id);
				const updatedProducts = [...products];
				updatedProducts[existingProductIndex] = this;
				products = updatedProducts;
			} else {
				this.id = Math.random().toString();
				products.push(this);
			}
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
			});
		});
	}

	// Static method to delete product by id
	static deleteById(id) {
		getProductsFromFIle((products) => {
			const updatedProducts = products.filter(prod => prod.id !== id);
			fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
				console.log(err);
			});
		});
	}
	// Static method to return products
	static fetchAll(cb) {
		getProductsFromFIle(cb);
	}

	// Static method to find product by id
	static findById(id, cb) {
		getProductsFromFIle(products => {
			const product = products.find(p => p.id === id);
			cb(product);
		});
	}
};