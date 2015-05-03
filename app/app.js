var app = angular.module('mapApp', []);

app.controller('KeyMapping', ['$scope', 'mapLevel', '$timeout', function($scope, mapLevel, $timeout) {
  $scope.debugMode = false;
  var markingValue = 5;
  $scope.mark = function(x, y) {
    if(!$scope.debugMode) {return}
    if($scope.gameBoard[x][y] == markingValue) {
      $scope.gameBoard[x][y] = 0;
    }
    else {
      $scope.gameBoard[x][y] = markingValue;
    }
  };

  $scope.changeLevel = function(level) {
    $scope.level = level;
    mapLevel.setLevel($scope.level);

    $scope.gameBoard = mapLevel.map;

    $scope.heroX = mapLevel.start.x;
    $scope.heroY = mapLevel.start.y;

    $scope.totalCarrots = mapLevel.countCarrots();

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

  function cycleMe() {
    $timeout(function() {
      $scope.currentCycle = ($scope.currentCycle + 1) % cyclePositions;
      if($scope.currentCycle != 3) {
        cycleMe();
      }
    }, 30);
  }

  $scope.currentCycle = 3;
  function move(directions){
    $scope.cycleDirection = moveMeBaby(directions);
    $scope.currentCycle = 4;
    cycleMe();

    var oldX = $scope.heroX;
    var oldY = $scope.heroY;

    var newX = bound(oldX + directions.x, "width");
    var newY = bound(oldY + directions.y, "height");

    moveYoshi(newX, newY, oldX, oldY);
  }

  $scope.hasGlasses = false;
  $scope.hasMagicKey = false;
  $scope.yoshiCarrots = 0;
  function moveYoshi(newX, newY, oldX, oldY) {
    var boardValue = $scope.gameBoard[newY][newX];
    var event = {};

    switch (boardValue) {
      case -1:
        event = {valid:false};
        break;
      case  1:
        if($scope.hasGlasses) {
          event = {valid:true};
        }
        else {
          event = {valid: false, msg: "You need the blue mushroom."};
        }
        break;
      case 2:
        $scope.yoshiCarrots += 1;
        $scope.gameBoard[newY][newX] = 0;
        event = {valid : true, msg: "Ate carrot! Nom nom!"};
        break;
      case 3:
        $scope.hasGlasses = true;
        $scope.gameBoard[newY][newX] = 0;
        event = {valid : true, msg: "Got the swimming mushroom! We can swim!"};
        break;
      case 4:
        $scope.hasMagicKey = true;
        $scope.gameBoard[newY][newX] = 0;
        event = {valid: true, msg: "Got the key! Collect all carrots and finish the game!"};
        break;
      case 5:
        if($scope.totalCarrots - $scope.yoshiCarrots == 0 && $scope.hasMagicKey) {
          event = {valid : true, msg: "You WON!"};
        }
        else {
          event = {valid : false, msg: "You need the key and all the carrots to finish!"};
        }
        break;
      default : event = {valid: true}
    }

    if(event.valid) {
      $scope.heroX = newX;
      $scope.heroY = newY;
    }
    else {
      $scope.heroX = oldX;
      $scope.heroY = oldY;
    }

    $scope.yoshiLog = event.msg;
  }

  // Taken from angular js website
  function simpleKeys (original) {
    return Object.keys(original).reduce(function (obj, key) {
      obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
      return obj;
    }, {});
  }
}]);