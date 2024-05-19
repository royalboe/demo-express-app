const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
	items: [
		{
			products: {
				type: Schema.Types.ObjectId,
				ref: "products",
			},
		},
	],
});

module.exports = mongoose.model('Orders', orderSchema);

// 	addOrder() {
// 		const db = getDb();
// 		return this.getCart().then((products) => {
// 			const order = {
//                 items: products,
//                 user : {
//                     _id: this._id,
//                     name: this.name,
//                 }
// 			};
//             return db
//                 .collection("orders")
//                 .insertOne(order)
// 		})
//             .then(() => {
//                 // this.cart = {items: []}
// 				return db
// 					.collection("users")
// 					.updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
// 			});
//     }
