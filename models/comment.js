var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	text: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	commentedOn: {type:Date ,default:Date.now}
});



module.exports = mongoose.model("Comment",commentSchema);