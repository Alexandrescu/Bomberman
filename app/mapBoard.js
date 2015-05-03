var app = angular.module('mapApp');

app.directive('mapBoard', function() {
  return {
    templateUrl: '/board',
    link: function(scope, element, attrs) {
      var parent = element[0].parentElement;
      var gameDiv = element[0].firstElementChild;

      // Am grija harta sa stea pe pagina, pentru ca pagina sa nu se miste
      scope.cellSize = Math.min(
        (gameDiv.clientWidth) / scope.boardSize.width,
        parent.clientHeight / scope.boardSize.height);
    }
  }
});
