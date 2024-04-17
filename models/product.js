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
	constructor(title, imageURL, description, price) {
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
	}

	// Method to save the product
	save() {
		getProductsFromFIle((products) => {
			this.id = Math.random().toString();
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
			});
		});
	}

	// Static method to return products
	static fetchAll(cb) {
		getProductsFromFIle(cb);
	}
};