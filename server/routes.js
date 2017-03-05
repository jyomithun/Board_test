var express = require('express'),
	path = require('path'),
	User = require('./models/user'),
	rootPath = path.normalize(__dirname + '/../'),
	apiRouter = express.Router(),
	router = express.Router();
	parent = {};

	function isAuth(req, res, next){
		console.log('is auth ?');
		if(req.isAuthenticated()){
			next();
		} else {
			res.json(500,{ message: 'Unauthorized access' });
		}
	}
	function isAuthWeb(req, res, next){
		if(req.isAuthenticated()){
			
			if(req.user.type === 1){
				console.log('cool you are an admin, carry on your way');
				req.user.admin = true;
			}
			next();
		} else {
			console.log('You are not an admin');
			res.redirect('/admin');
		}
	}
	function isAdmin(req, res, next){
		if(req.isAuthenticated() && req.user.type === 1){
			
			req.user.admin = true;
			console.log('cool you are an admin, carry on your way');
			next();
		} else {
			console.log('You are not an admin');
			res.redirect('/admin');
		}
	}
	parent.isAuth = isAuth;
	parent.isAdmin = isAdmin;
module.exports = function(app, passport){	
	app.use('/api', apiRouter);
	app.use('/', router);

	// API routes
	require('./api/posts')(apiRouter,parent);

	// API routes
	require('./api/users')(apiRouter,parent);

	// home route
	router.get('/', function(req, res) {
		res.render('index');
	});

	// admin route
	router.get('/admin', function(req, res) {
		res.render('admin/login', { message: '' });
	});
	
	router.get('/api/logout', function(req, res) {
		req.logout();
		req.session.destroy(function (err,a) {
			console.log(err);
			res.json({ message: 'logged out' });
		});
	});
	
	router.get('/admin/register', function(req, res) {
		res.render('admin/register',{ message: '' });
	});

	//router.get('/admin/dashboard', isAdmin, function(req, res){
	router.get('/admin/dashboard', isAuthWeb, function(req, res){
		res.render('admin/dashboard', {user: req.user});
	});

	router.post('/register', function(req, res){

		// passport-local-mongoose: Convenience method to register a new user instance with a given password. Checks if username is unique
		
		var msg = '';
		User.register(new User({
			email: req.body.email
		}), req.body.password, function(err, user) {
	        if (err) {
	            console.error(err);
				msg = err.message;
	        }else{
				//console.log(user);
				msg = 'Wait for the approval of admin';
			}
			res.render('admin/register', { message: msg });

	        // log the user in after it is created
			/*
	        passport.authenticate('local')(req, res, function(){
				console.log(user);
				User.findById(user._id, function(err, user){
					if(err) res.send(err);
		
					user.name = req.body.name;
		
					user.save(function(err){
						if(err) res.send(err);
						console.log('authenticated by passport');
						res.redirect('/admin/dashboard');

					})
				});
	        });
			*/
	    });
	});

	router.post(
		'/login', 
		function(req, res, next){
			User.findOne( { email: req.body.email } , function(err, user){
				if(err){
					res.render('admin/login', { message: err });
				}else if(user.status == 'Authorized'){
					next();
				}else{
					res.render('admin/login', { message: 'Wait for the approval of admin' });
					return;
				}
			});
		},
		passport.authenticate('local'), 
		function(req, res){
			res.redirect('/admin/dashboard');
		}
	);

	app.use(function(req, res, next){
		res.status(404);

		res.render('404');
		return;
	});
	
};

