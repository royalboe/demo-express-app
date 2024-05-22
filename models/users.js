const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	fullname: {
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
	password: {
		type: String,
		required: true,
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
userSchema.methods.clearCartItems = clearCartItems;

module.exports = mongoose.model('User', userSchema);


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
		return this.save();
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

function clearCartItems() {
	this.cart = { items: [] };
	return this.save()
};