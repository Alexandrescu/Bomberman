var app = angular.module('mapApp');

app.directive('mapBoard', function() {
  return {
    templateUrl: '/board',
    link: function(scope, element, attrs) {
      console.log(element[0].firstElementChild.clientWidth);
      var parent = element[0].parentElement;
      var gameDiv = element[0].firstElementChild;

      scope.cellSize = Math.min(
        (gameDiv.clientWidth)/ scope.boardSize.width,
        parent.clientHeight / scope.boardSize.height);
      console.log(scope.cellSize);
    }
  }
});
