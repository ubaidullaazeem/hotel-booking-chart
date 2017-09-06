(function() {
  'use strict';

  // Newbookings controller
  angular
    .module('newbookings')
    .controller('LargeImageController', LargeImageController);

  LargeImageController.$inject = ['$scope', '$mdDialog' ,'filePath', 'DATA_BACKGROUND_COLOR'];

  function LargeImageController($scope, $mdDialog, filePath, DATA_BACKGROUND_COLOR) {
    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.filePath = filePath;

    $scope.cancel = function(bookingForm) {
      $mdDialog.cancel();        
    };
}
}());