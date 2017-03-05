var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	user_id: mongoose.Schema.ObjectId,
	title: { type: String, required: '{PATH} is required!'},
	body: { type: String, required: '{PATH} is required!'},
	type: {
		type: Number, 
		default: 0 // 0 public user , 1 private post
	},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

postSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Post', postSchema);