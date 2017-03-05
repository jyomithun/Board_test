var Post = require('../models/post');

// Posts API
module.exports = function(apiRouter,parent){
	
	// get all posts
	apiRouter.get('/public-posts', function(req, res){
	
		Post.find({ type: 0 }, function(err, posts){
			if (err) res.send(err);

			res.json(posts);
		});
	});
	
	// get all posts
	apiRouter.get('/posts', parent.isAuth, function(req, res){
		
		var where = {}
		if(req.user.type == 0) // is user
		{
			where = { user_id: req.user._id }
		}
		Post.find(where, function(err, posts){
			if (err) res.send(err);

			res.json(posts);
		});
	});

	// add a post
	apiRouter.post('/posts', parent.isAuth, function(req, res){
		
		var post = new Post();
		post.user_id = req.user._id;
		post.title = req.body.title;
		post.body = req.body.body;
		post.type = req.body.type;

		post.save(function(err, post){
			if(err){
				res.json(500,{ message: err.message });
			}else{
				res.json(200,{ message: 'post published', data: post });
			}
		})
	});

	// get a single post
	apiRouter.get('/posts/:id', function(req, res){
		Post.findById(req.params.id, function(err, post){
			if (err) res.send(err);

			res.json(post);
		});
	});

	// update a post
	apiRouter.put('/posts/:id', function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err) res.send(err);

			post.title = req.body.title;
			post.body = req.body.body;

			post.save(function(err){
				if(err) res.send(err);

				res.json({ message: 'Post updated!' });
			})
		});
	});

	// delete a post
	apiRouter.delete('/posts/:id', function(req, res){
		Post.remove({
			_id: req.params.id
		}, function(err, post){
			if(err) res.send(err);

			res.json({ message: 'Post deleted!' });
		})
	});
};