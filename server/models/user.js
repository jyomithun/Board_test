var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
	name: String,
	email: {
		type: String, 
		required: '{PATH} is required!'
	},
	status: {
		type: String, 
		default: 'Un Authorized'
	},
	type: {
		type: Number, 
		default: 0 // 0 normal user , 1 admin user
		// to make a user as admin run the following command with suitable _id
		// db.users.update({ "_id" : ObjectId("58b8001e1ac0130fbc7e9d00") },{$set:{type:1}});
	},
});

// Passport-Local-Mongoose will add a username, 
// hash and salt field to store the username, 
// the hashed password and the salt value

// configure to use email for username field
User.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', User);