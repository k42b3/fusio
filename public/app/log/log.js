'use strict';

angular.module('fusioApp.log', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/log', {
    templateUrl: 'app/log/index.html',
    controller: 'LogCtrl'
  });
}])

.controller('LogCtrl', ['$scope', '$http', function($scope, $http){

	$scope.response = null;
	$scope.search = '';
	$scope.routes = [];
	$scope.apps = [];

	$scope.load = function(){
		var search = encodeURIComponent($scope.search);

		$http.get(fusio_url + 'backend/log?search=' + search).success(function(data){
			$scope.totalItems = data.totalItems;
			$scope.startIndex = 0;
			$scope.logs = data.entry;
		});
	};

	$scope.pageChanged = function(){
		var startIndex = ($scope.startIndex - 1) * 16;
		var search = encodeURIComponent($scope.search);

		$http.get(fusio_url + 'backend/log?startIndex=' + startIndex + '&search=' + search).success(function(data){
			$scope.totalItems = data.totalItems;
			$scope.logs = data.entry;
		});
	};

	$scope.doFilter = function(filter){
		var query = '';
		for (var key in filter) {
			if (filter[key]) {
				query+= key + '=' + encodeURIComponent(filter[key]) + '&';
			}
		}

		$http.get(fusio_url + 'backend/log?' + query).success(function(data){
			$scope.totalItems = data.totalItems;
			$scope.startIndex = 0;
			$scope.logs = data.entry;
		});
	};

	$scope.openDetailDialog = function(log){
		var modalInstance = $modal.open({
			size: 'lg',
			templateUrl: 'app/log/update.html',
			controller: 'ConnectionUpdateCtrl',
			resolve: {
				log: function(){
					return log;
				}
			}
		});

		modalInstance.result.then(function(response){
			$scope.response = response;
			$scope.load();

			$timeout(function(){
				$scope.response = null;
			}, 2000);
		}, function(){
		});
	};

	$http.get(fusio_url + 'backend/routes')
		.success(function(data){
			$scope.routes = data.entry;
		});

	$http.get(fusio_url + 'backend/app')
		.success(function(data){
			$scope.apps = data.entry;
		});

	$scope.load();

}]);