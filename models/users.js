const { ObjectId } = require("mongodb");
const getDb = require("../util/database").getDb;
class User {
	constructor(username, email, id) {
		this.name = username;
		this.email = email;
		this._id = id ? ObjectId.createFromHexString(id) : null;
	}

	save() {
		const db = getDb();
		return db
			.collection("users")
			.insertOne(this)
			.then(() => {
				console.log("Insert successful");
				console.log(dbOp);
			})
			.catch((err) => console.log(err));
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
