
adminApp.controller('NavCtrl', function($scope, $state){
	$scope.active = $state;
	$scope.isActive = function(viewLocation){
		var active = (viewLocation === $state.current.name);
		return active;
	};
});

adminApp.controller('AllPostsCtrl', function($scope, postList,Posts){
	$scope.posts = postList;
	$scope.activePost = false;
	$scope.setActive = function(post){
		$scope.activePost = post;
	}
	
	$scope.post = {};
	$scope.deletePost = function(id){
		
		var CB = function(res){ console.log(res); location.reload();  }
		if(id){
			Posts.remove(id,CB).then(function(res){
				
			});
		}else{
			console.log(' no id');
		}

	};
	
});

adminApp.controller('AddPostCtrl', function($scope, Posts){
	$scope.post = {};
	$scope.addPost = function(newPost){
		Posts.add(newPost).then(function(res){
			console.log(res);
			$scope.action = { type: 'alert alert-success', msg: res.data.message };
		});
	};


});

adminApp.controller('AllUsersCtrl', function($scope,$http){
											 
	$scope.users = {};
	$http({
		method: 'get',
		url: '/api/users'
	}).then(function(res){
		// return the new user
		$scope.users = res.data;
		console.log(res.data);
	}).catch(function(err){
		console.error('Something went wrong adding the user!');
		console.error(err);
	});
	
	$scope.post = {};
	$scope.deleteUser = function(id){
		
		var CB = function(res){ console.log(res); location.reload();  }
		if(id){
			$http({
				method: 'delete',
				url: '/api/users/'+id
			}).then(function(res){
				// return the new user
				console.log(res.data);
				CB();
			}).catch(function(err){
				console.error('Something went wrong adding the user!');
				console.error(err);
			});
		}else{
			console.log(' no id');
		}
	};
	$scope.authUser = function(id){
		
		var CB = function(res){ console.log(res); location.reload();  }
		if(id){
			$http({
				method: 'get',
				url: '/api/users/auth/'+id
			}).then(function(res){
				// return the new user
				console.log(res.data);
				CB();
			}).catch(function(err){
				console.error('Something went wrong adding the user!');
				console.error(err);
			});
		}else{
			console.log(' no id');
		}
	};
	
});

adminApp.controller('AddUserCtrl', function($scope, $http){
											
	$scope.user = {};
	$scope.action = {};
	
	$scope.addUser = function(newUser){
		$http({
			method: 'post',
			url: '/api/users',
			data: newUser
		}).then(function(res){
			$scope.action = { type: 'alert alert-success', msg: res.data.message };
			console.log(res.data);
		}).catch(function(res){
			console.error('Something went wrong adding the user!');
			$scope.action = { type: 'alert alert-danger', msg: res.data.message };
		});
	};


});