var mongoose = require("mongoose");

//Schema SetUp
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	price: String,
	description: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Comment"
		}
	],
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Campground", campgroundSchema);