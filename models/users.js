const { ObjectId } = require("mongodb");
const getDb = require("../util/database").getDb;
class User {
	constructor(username, email, cart, id) {
		this.name = username;
		this.email = email;
		this.cart = cart;
		this._id = id;
	}

	save() {
		const db = getDb();
		return db
			.collection("users")
			.insertOne(this)
			.then(() => {
				console.log("Insert successful");
			})
			.catch((err) => console.log(err));
	}

	addToCart(product) {
		// const updatedCart = {
		//     productId: product._id,
		//     quantity: 1
		// }
		// const db = getDb();
		// return db.collection("users").updateOne(
		// 			{
		// 				_id: this._id,
		// 			},
		// 			{ $set: { cart: { items: [updatedCart] } } }
		// 		);

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
		const db = getDb();
		return db
			.collection("users")
			.updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
	}

	deleteFromCart(productId) {
		const updatedCart = this.cart.items.filter((item) => {
			return item.productId.toString() !== productId.toString();
		});
		const db = getDb();
		return db
			.collection("users")
			.updateOne({ _id: this._id }, { $set: { cart: { items: updatedCart } } });
	}

	getCart() {
		const db = getDb();
		const productIds = this.cart.items.map((i) => {
			return i.productId;
		});
		return db
			.collection("products")
			.find({ _id: { $in: productIds } })
			.toArray()
			.then((products) => {
				return products.map((p) => {
					return {
						...p,
						quantity: this.cart.items.find((i) => {
							return i.productId.toString() === p._id.toString();
						}).quantity,
					};
				});
			});
	}

	addOrder() {
		const db = getDb();
		return this.getCart().then((products) => {
			const order = {
                items: products,
                user : {
                    _id: this._id,
                    name: this.name,
                }
			};
            return db
                .collection("orders")
                .insertOne(order)
		})
            .then(() => {
                // this.cart = {items: []}
				return db
					.collection("users")
					.updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
			});
    }
    
    getOrders() {
        const db = getDb();
        return db
            .collection('orders')
            .find({ 'user._id': this._id })
            .toArray();
    }

	static findById(userId) {
		const db = getDb();
		return db
			.collection("users")
			.findOne({ _id: ObjectId.createFromHexString(userId) })
			.then((user) => {
				console.log(user);
				return user;
			})
			.catch((err) => console.log(err));
	}
}

module.exports = User;
