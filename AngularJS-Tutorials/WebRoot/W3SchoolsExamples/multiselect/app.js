var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('AppCtrl', ["$scope", function ($scope) {
    $scope.status = {
        isopen: false
    };

    $scope.FirstItems = [{ Id: 1, Name: "Chrome", IsSelected: false },
	                 { Id: 2, Name: "Firefox", IsSelected: false },
                        { Id: 3, Name: "IE", IsSelected: false}];
    $scope.FirstSelectedItems = [];

    var removeItem = function (items, item) {
        for (var index = 0; index < items.length; index++) {
            if (item.Id == items[index].Id) {
                item.IsSelected = false;
                items.splice(index, 1);
                break;
            }
        }
    };
    $scope.removeFirstItem = function (item) {
        removeItem($scope.FirstSelectedItems, item);
    };

} ]);

app.directive('dropdownMultiselect', function () {
    return {
        restrict: 'A',
        scope: {
            items: "=",
            selectedItems: "="
        },
        template: "<div class='dropdown col-md-1 offset0 margintLeft15 marginRigth5' is_open='status.open'>" +
                        "<button type='button' class='btn btn-success dropdown-toggle' ng-click='openDropdown($event)'>" +
                            "Add <span class='caret'></span>" +
                        "</button>" +
                        "<div class='dropdown-menu expertDropList' >" +
                            "<div class='col-md-12 marginBottom15'>" +
                               "<div class='pull-right'>" +
                                    "<button class='btn btn-sm btn-success' ng-click='selectAll($event)'>Check All</button>" +
                                    "<button class='btn btn-sm btn-success' ng-click='deselectAll($event);'>Uncheck All</button>" +
                                "</div>" +
                            "</div>" +
                            "<div data-ng-repeat='item in items' class='expertDropListBox' ng-click='handleClick($event)'>" +
                                "<input type='checkbox' ng-model='item.IsSelected' ng-click='clickItem($event)' ng-change='selectItem(item)' />" +
                                "{{item.Name}}" +
                            "</div>" +
                        "</div>" +
                    "</div>",
        controller: function ($scope) {
            $scope.handleClick = function ($event) {
                $event.stopPropagation();
            };
            $scope.status = {
                isopen: false
            };
            $scope.status = { isopen: false };
            $scope.openDropdown = function ($event) {
                if ($scope.items != undefined && $scope.items.length > 0) {
                    for (var index = 0; index < $scope.items.length; index++) {
                        $scope.items[index].IsSelected = false;
                    }
                    if ($scope.selectedItems != undefined && $scope.selectedItems.length > 0) {
                        for (var selectedItemIndex = 0; selectedItemIndex < $scope.selectedItems.length; selectedItemIndex++) {
                            for (var itemIndex = 0; itemIndex < $scope.items.length; itemIndex++) {
                                if ($scope.selectedItems[selectedItemIndex].Id == $scope.items[itemIndex].Id) {
                                    $scope.items[itemIndex].IsSelected = true;
                                    break;                                    
                                }
                            }
                        }
                    }
                }
                $event.stopPropagation();
                $scope.status.isopen = true;
            };

            $scope.selectAll = function ($event) {
                $scope.selectedItems = [];
                angular.forEach($scope.items, function (item) {
                    item.IsSelected = true;
                    $scope.selectedItems.push(item);
                });
                $event.stopPropagation();
            };
            $scope.deselectAll = function ($event) {
                angular.forEach($scope.items, function (item) {
                    item.IsSelected = false;
                });
                $scope.selectedItems = [];
                $event.stopPropagation();
            };
            $scope.selectItem = function (item) {
                if (item.IsSelected == false) {
                    for (var index = 0; index < $scope.selectedItems.length; index++) {
                        if (item.Id == $scope.selectedItems[index].Id) {
                            item.IsSelected = false;
                            $scope.selectedItems.splice(index, 1);
                            break;
                        }
                    }
                } else {
                    $scope.selectedItems.push(item);
                }
            };

            $scope.clickItem = function ($event) {
                $event.stopPropagation();
            };

        }
    };
});
