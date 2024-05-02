const getDb = require("../util/database").getDb;

class Product {
	constructor(title, price, imageURL, description) {
		this.title = title;
		this.price = price;
		this.imageURL = imageURL;
		this.description = description;
	}

	save() {
		const db = getDb();
		return db
			.collection("products")
			.insertOne(this)
			.then(() => console.log("Insert successful"))
			.catch((err) => console.log(err));
	}
}

// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imageURL: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

module.exports = Product;
