var app = angular.module("Demo",["ngRoute"]);

app.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when("/home", {
			templateUrl: "template/home.html",
			controller:"homeController"
		})
		.when("/courses", {
			templateUrl: "template/courses.html",
			controller:"coursesController"
		})
		.when("/students/:param", {
			templateUrl: "template/students.html",
			controller:"studentsController"
		}).otherwise({
			redirectTo : "/home"
		});
});

app.controller("homeController",['$scope', '$rootScope', function($scope, $rootScope){
	$scope.message = "Home Page";
	
	$rootScope.testMsg = "This is root message";
	
	 
}]);

app.controller("coursesController",function($scope, $rootScope){
	$scope.message = "courses Page";
	
	console.log($rootScope.testMsg);
});

app.controller("studentsController",function($scope, $routeParams){
	$scope.message = "students Page";
	$scope.param = $routeParams.param;
	console.log($scope.param);
});