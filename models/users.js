const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = require('./product');

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: { type: Number, required: true }
    }]
  }
}, {
	timestamps: true,
});

userSchema.methods.addToCart = addToCart;
userSchema.methods.deleteFromCart = deleteFromCart;

module.exports = mongoose.model('User', userSchema);

// const { ObjectId } = require("mongodb");
// const getDb = require("../util/database").getDb;
// class User {
// 	constructor(username, email, cart, id) {
// 		this.name = username;
// 		this.email = email;
// 		this.cart = cart;
// 		this._id = id;
// 	}

// 	save() {
// 		const db = getDb();
// 		return db
// 			.collection("users")
// 			.insertOne(this)
// 			.then(() => {
// 				console.log("Insert successful");
// 			})
// 			.catch((err) => console.log(err));
// 	}

function addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex((cp) => {
			return cp.productId.toString() === product._id.toString();
		});
		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items];

		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		} else {
			updatedCartItems.push({
				productId: product._id,
				quantity: newQuantity,
			});
		}
		const updatedCart = {
			items: updatedCartItems,
		};
		this.cart = updatedCart;
		this.save();
};

function deleteFromCart(productId) {
  console.log(this.cart)
  const updatedCart = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  console.log(updatedCart);
  this.cart.items = updatedCart;
  return this.save();
};


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
    
//     getOrders() {
//         const db = getDb();
//         return db
//             .collection('orders')
//             .find({ 'user._id': this._id })
//             .toArray();
//     }

// 	static findById(userId) {
// 		const db = getDb();
// 		return db
// 			.collection("users")
// 			.findOne({ _id: ObjectId.createFromHexString(userId) })
// 			.then((user) => {
// 				console.log(user);
// 				return user;
// 			})
// 			.catch((err) => console.log(err));
// 	}
// }

// module.exports = User;
