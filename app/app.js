var app = angular.module('mapApp', []);

app.controller('KeyMapping', ['$scope', 'mapLevel', '$timeout', function($scope, mapLevel, $timeout) {
  /*
      Functie de debug. Cand asta e activata pot sa creez harti!
   */
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

  /*
      Functia care este trigger-uita cand apas Level 1/2
   */
  $scope.changeLevel = function(level) {
    // Atributele lui Bijoux-Yoshi
    $scope.hasGlasses = false;
    $scope.hasMagicKey = false;
    $scope.yoshiCarrots = 0;
    $scope.won = false;

    // Inglobarea hartii
    $scope.level = level;
    mapLevel.setLevel($scope.level);

    $scope.gameBoard = mapLevel.map;

    $scope.boardSize = {
      height: $scope.gameBoard.length,
      width : $scope.gameBoard[0].length
    };

    $scope.totalCarrots = mapLevel.countCarrots();

    // Coordonatele + pozitia fetei
    $scope.heroX = mapLevel.start.x;
    $scope.heroY = mapLevel.start.y;
    $scope.cycleDirection = 0;
  };

  // Nivelul initial
  $scope.changeLevel(2);

  // Dimensiune temporara a unui cell
  $scope.cellSize = 40;

  // Event-ul trigger-uit atunci cand apas un buton
  $scope.buttonPress = function($event) {
    $scope.press = $event.keyCode;
    $scope.key = String.fromCharCode($scope.press);
    $scope.pressEvent = simpleKeys($event);
    console.log($event);

    move(normalize($scope.press));
  };

  // Traduceri din/inspre obiecte
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

  // Intoarce o directie pentru tasta respectiva
  function normalize(keyCode) {
    if(keyMap.hasOwnProperty(keyCode)) {
      return keyMap[keyCode];
    }
    else {
      return null;
    }
  }

  // Marginea hartii
  function bound(number, property) {
    var upperBound = $scope.boardSize[property];
    if(number >= upperBound) return upperBound - 1;
    if(number < 0) return 0;
    return number;
  }

  // Yoshi are pozitii intr-o miscare
  var cyclePositions = 5;

  // Directia in care trebuie sa se uite
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

  // Functia care il face pe Yoshi sa cicleze
  function cycleMe() {
    $timeout(function() {
      $scope.currentCycle = ($scope.currentCycle + 1) % cyclePositions;
      if($scope.currentCycle != 3) {
        cycleMe();
      }
    }, 30);
  }

  // Incepem de pe mijlocul imaginii
  $scope.currentCycle = 3;
  function move(directions){
    // Atunci cand castig ma opresc.
    if($scope.won) {return;}
    $scope.cycleDirection = moveMeBaby(directions);
    $scope.currentCycle = 4;
    // Incepem animatia
    cycleMe();

    // Computam ultima si actuala locatie
    var oldX = $scope.heroX;
    var oldY = $scope.heroY;

    var newX = bound(oldX + directions.x, "width");
    var newY = bound(oldY + directions.y, "height");

    moveYoshi(newX, newY, oldX, oldY);
  }

  function moveYoshi(newX, newY, oldX, oldY) {
    var boardValue = $scope.gameBoard[newY][newX];
    var event = {};

    switch (boardValue) {
      // Patratica goala
      case 0:
        event = {valid: true};
        break;
      // Patratica invalida
      case -1:
        event = {valid:false};
        break;
      // Patratica care merge in apa
      case  1:
        if($scope.hasGlasses) {
          event = {valid:true};
        }
        else {
          event = {valid: false, msg: "You need the blue mushroom."};
        }
        break;
      // Patratica care are morcov
      case 2:
        $scope.yoshiCarrots += 1;
        $scope.gameBoard[newY][newX] = 0;
        event = {valid : true, msg: "Ate carrot! Nom nom!"};
        break;
      // Patratica care are swimming mushroom
      case 3:
        $scope.hasGlasses = true;
        $scope.gameBoard[newY][newX] = 0;
        event = {valid : true, msg: "Got the swimming mushroom! We can swim!"};
        break;
      // Patratica care are cheie
      case 4:
        $scope.hasMagicKey = true;
        $scope.gameBoard[newY][newX] = 0;
        event = {valid: true, msg: "Got the key! Collect all carrots and finish the game!"};
        break;
      // Patratica care are locatia finala
      case 5:
        if($scope.totalCarrots - $scope.yoshiCarrots == 0 && $scope.hasMagicKey) {
          event = {valid : true, msg: "You WON!"};
          $scope.won = true;
        }
        else {
          event = {valid : false, msg: "You need the key and all the carrots to finish!"};
        }
        break;
      default : event = {valid: false}
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

  // De pe AngularJS
  function simpleKeys (original) {
    return Object.keys(original).reduce(function (obj, key) {
      obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
      return obj;
    }, {});
  }
}]);