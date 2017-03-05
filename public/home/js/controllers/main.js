
app.controller('MainCtrl', function ($scope, $http, $mdSidenav, $mdUtil, $log) {

    $scope.posts = [];
	$http({
		method: 'get',
		url: '/api//public-posts/'
	}).then(function(res){
		$scope.posts = res.data;
	}).catch(function(err){
		console.error('Something went wrong adding the user!');
		console.error(err);
	});

	
    $scope.toggleRight = buildToggler('right');

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
              });
          },300);

      return debounceFn;
    }

  })
  .controller('SidenavCtrl', function ($scope, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  });