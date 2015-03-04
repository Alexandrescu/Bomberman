var app = angular.module('mapApp', []);

app.controller('KeyMapping', ['$scope', function($scope) {
  $scope.gameBoard = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8]
  ];

  $scope.boardSize = {
    height: 8,
    width : 8
  };

  $scope.heroX = $scope.heroY = 0;

  $scope.clickMe = function($event) {
    $scope.press = $event.keyCode;
    $scope.key = String.fromCharCode($scope.press);
    $scope.pressEvent = simpleKeys($event);
    console.log($event);

    move(normalize($scope.press));
  };

  var up = {x : 0, y : -1};
  var down = {x : 0, y : 1};
  var left = {x : -1, y : 0};
  var right = {x : 1, y : 0};

  var keyMap = {
    87 : up,
    65 : left,
    83 : down,
    68 : right,
    37 : left,
    38 : up,
    39 : right,
    40 : down
  }

  function normalize(keyCode) {
    if(keyMap.hasOwnProperty(keyCode)) {
      return keyMap[keyCode];
    }
    else {
      return null;
    }
  }

  function bound(number, property) {
    var upperBound = $scope.boardSize[property];
    if(number >= upperBound) return upperBound - 1;
    if(number < 0) return 0;
    return number;
  }

  function move(directions){
    $scope.heroX = bound($scope.heroX + directions.x, "width");
    $scope.heroY = bound($scope.heroY + directions.y, "height");
  }

  // Taken from angular js website
  function simpleKeys (original) {
    return Object.keys(original).reduce(function (obj, key) {
      obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
      return obj;
    }, {});
  };

  $scope.test = "everyone"
}]);