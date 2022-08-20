angular.module('myApp', []).controller('firstcntrl', function($scope) {
    $scope.t1 = "prakash";
    $scope.t2 = "gangadharan";
    $scope.t3 = function() {
        return $scope.t1 + " " + $scope.t2;
    }
});
