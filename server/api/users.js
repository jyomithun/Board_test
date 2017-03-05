var User = require('../models/user');

// Users API
module.exports = function(apiRouter,parent){
	
	// get all users
	apiRouter.get('/users', parent.isAuth, function(req, res){
		User.find({}, function(err, users){
			if (err) res.send(err);

			res.json(users);
		});
	});

	// add a user
	apiRouter.post('/users', parent.isAuth, function(req, res){
		
		// passport-local-mongoose: Convenience method to register a new user instance with a given password. Checks if username is unique
		User.register(new User({
			email: req.body.email
		}), req.body.password, function(err, user) {
	        if (err) {
	            res.json(500,{ message: err.message });
	            return;
	        }else{
				console.log(user);
				User.findById(user._id, function(err, user){
					if(err){
						res.send(err);
					}else{
						user.name = req.body.name;
						user.save(function(err){
							if(err){
								res.json(500,{ message: err.message });
							}else{
								res.json(200,{ message: 'user created', data: user });
							}
						});
					}
				});
			}
	    });
	
	});

	// get a single user
	apiRouter.get('/users/:id', parent.isAuth, function(req, res){
		User.findById(req.params.id, function(err, user){
			if (err) res.send(err);

			res.json(user);
		});
	});

	// authorise a user
	apiRouter.get('/users/auth/:id', parent.isAuth, function(req, res){
		User.findById(req.params.id, function(err, user){
			if(err) res.send(err);

			if(user.status == 'Authorised'){
				user.status = 'Un Authorized';
			}else{
				user.status = 'Authorized';
			}
			user.save(function(err){
				if(err) res.send(err);

				res.json({ message: 'User updated!' });
			})
		});
	});

	// update a user
	apiRouter.put('/users/:id', parent.isAuth, function(req, res){
		User.findById(req.params.id, function(err, user){
			if(err) res.send(err);

			user.title = req.body.title;
			user.body = req.body.body;

			user.save(function(err){
				if(err) res.send(err);

				res.json({ message: 'User updated!' });
			})
		});
	});

	// delete a user
	apiRouter.delete('/users/:id', parent.isAuth, function(req, res){
		User.remove({
			_id: req.params.id
		}, function(err, user){
			if(err) res.send(err);

			res.json({ message: 'User deleted!' });
		})
	});
};