const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
	constructor(title, price, imageURL, description, id) {
		this.title = title;
		this.price = price;
		this.imageURL = imageURL;
		this.description = description;
		this._id = id
	}

	save() {
		const db = getDb();
		return db
			.collection("products")
			.insertOne(this)
			.then(() => console.log("Insert successful"))
			.catch((err) => console.log(err));
	}

	static fetchAll() {
		const db = getDb();
		return db
			.collection("products")
			.find()
			.toArray()
			.then((products) => {
				console.log(products);
				return products;
			})
			.catch((err) => console.log(err));
	}

	static findByPk(prodId) {
		const db = getDb();
		return db
			.collection("products")
			.find({ _id: new mongodb.ObjectId(prodId) })
			.next()
			.then((product) => {
				console.log(product);
				return product;
			})
			.catch((err) => console.log(err));
	}
}

module.exports = Product;
