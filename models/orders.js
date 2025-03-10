const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	user: {
		email: {
			type: String,
			required: true
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true
		}
	},
	items: [
		{
			product: {
				type: Object,
				required: true
			},
			quantity: {
				type: Number,
				required: true
			}
		},
	],
});

module.exports = mongoose.model('Orders', orderSchema);
