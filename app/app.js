var app = angular.module('mapApp', []);

app.controller('KeyMapping', ['$scope', 'mapLevel', '$timeout', function($scope, mapLevel, $timeout) {
  $scope.changeLevel = function(level) {
    $scope.level = level;
    mapLevel.setLevel($scope.level);

    $scope.gameBoard = mapLevel.map;

    $scope.heroX = mapLevel.start.x;
    $scope.heroY = mapLevel.start.y;

    $scope.boardSize = {
      height: $scope.gameBoard.length,
      width : $scope.gameBoard[0].length
    };
  };

  $scope.changeLevel(2);

  $scope.cellSize = 40;

  $scope.buttonPress = function($event) {
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
  };

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

  var cyclePositions = 5;

  function moveMeBaby(direction) {
    switch(direction) {
      case up:
        return 3;
      case down:
        return 0;
      case right:
        return 2;
      case left:
        return 1;
      default: return -1;
    }
  }

  $scope.currentCycle = 3;
  function move(directions){
    var oldDirection = $scope.cycleDirection;
    $scope.cycleDirection = moveMeBaby(directions);
    $scope.currentCycle = ($scope.currentCycle + 1) % cyclePositions;

    if($scope.cycleDirection != oldDirection) {
      $scope.currentCycle = 3;
    }

    // Precision error
    var oldX = $scope.heroX;
    var oldY = $scope.heroY;


    /*
    var stepX = directions.x / cyclePositions;
    var stepY = directions.y / cyclePositions;
    while($scope.currentCycle != 0) {
      $scope.heroX = bound($scope.heroX + stepX);
      $scope.heroY = bound($scope.heroY + stepY);
      $scope.currentCycle = ($scope.currentCycle + 1) % cyclePositions;
    }
    */

    $scope.heroX = bound(oldX + directions.x, "width");
    $scope.heroY = bound(oldY + directions.y, "height");
  }

  // Taken from angular js website
  function simpleKeys (original) {
    return Object.keys(original).reduce(function (obj, key) {
      obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
      return obj;
    }, {});
  }
}]);