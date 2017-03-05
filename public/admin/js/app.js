
var adminApp = angular.module('mean-blog.admin', [
	'ui.router',
	'btford.markdown',
	'mean-blog.posts'
]);

adminApp.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/');
	
	$stateProvider
		.state('allPosts', {
			url: '/',
			templateUrl: '/admin/templates/allPosts.html',
			resolve: {
				postList: function(Posts){
					return Posts.all().then(function(data){
						return data;
					});
				}
			},
			controller: 'AllPostsCtrl'
		})
		.state('addPost', {
			url: '/addPost',
			templateUrl: '/admin/templates/addPost.html',
			controller: 'AddPostCtrl'
		})
		.state('addUser', {
			url: '/addUser',
			templateUrl: '/admin/templates/addUser.html',
			controller: 'AddUserCtrl'
		})
		.state('allUsers', {
			url: '/allUsers',
			templateUrl: '/admin/templates/allUsers.html',
			controller: 'AllUsersCtrl'
		});
		
});

adminApp.run(function($rootScope,$http){

	$rootScope.logout = function(){
		$http({
			method: 'get',
			url: '/api/logout'
		}).then(function(res){
			location.reload();
		}).catch(function(err){
			location.reload();
		});
	}
});

