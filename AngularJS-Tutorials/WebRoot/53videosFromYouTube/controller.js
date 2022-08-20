var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
	
	$scope.firstName = "John";
	$scope.lastName = "Doe";
	$scope.fullname = function() {
		return $scope.firstName + " " + $scope.lastName;
	};
});

app.controller('myCtrl2', function($scope) {
	// for ng-repeat
	// for multiple controller
    $scope.scopeNames =[
                   {fname:'Prakash',lname:'Ganga'},
                   {fname:'Johnson',lname:'Anthony'},
                   {fname:'Palani',lname:'Vaithee'}
                   ];
});