const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productObj = {
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	imageURL: {
		type: String,
		required: true
	},
}

const productData = new Schema(productObj);

// const {ObjectId} = require("mongodb");
// const getDb = require("../util/database").getDb;

// class Product {
// 	constructor(title, price, imageURL, description, userId, id) {
// 		this.title = title;
// 		this.price = price;
// 		this.imageURL = imageURL;
// 		this.description = description;
// 		this.userId = userId
// 		this._id = id ? ObjectId.createFromHexString(id) : null;
// 	}

// 	save() {
// 		const db = getDb();
// 		let dbOp;
// 		if (this._id) {
// 			//Update product
// 			dbOp = db
// 				.collection("products")
// 				.updateOne({ _id: this._id }, { $set: this });
// 		} else {
// 			dbOp = db.collection("products").insertOne(this);
// 		}
// 		return dbOp
// 			.then(() => console.log("Insert successful"))
// 			.catch((err) => console.log(err));
// 	}

// 	static fetchAll() {
// 		const db = getDb();
// 		return db
// 			.collection("products")
// 			.find()
// 			.toArray()
// 			.then((products) => {

// 				return products;
// 			})
// 			.catch((err) => console.log(err));
// 	}

// 	static findByPk(prodId) {
// 		const db = getDb();
// 		return db
// 			.collection("products")
// 			.find({ _id: ObjectId.createFromHexString(prodId) })
// 			.next()
// 			.then((product) => {
// 				console.log(product);
// 				return product;
// 			})
// 			.catch((err) => console.log(err));
// 	}

// 	static deleteById(prodId) {
// 		const db = getDb();
// 		return db
// 			.collection("products")
// 			.deleteOne({ _id: ObjectId.createFromHexString(prodId) })
// 			.then(() => console.log("Deleted successfully"))
// 			.catch((err) => console.log(err));
// 	}
// }

// module.exports = Product;
