var app = angular.module('mapApp', []);

app.controller('KeyMapping', ['$scope', function($scope) {

  $scope.clickMe = function($event) {
    $scope.press = $event.keyCode;
    $scope.key = String.fromCharCode($scope.press);
    $scope.pressEvent = simpleKeys($event);
    console.log($event);
  };

  // Taken from angular js website
  function simpleKeys (original) {
    return Object.keys(original).reduce(function (obj, key) {
      obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
      return obj;
    }, {});
  };

  $scope.test = "andrei"
}]);