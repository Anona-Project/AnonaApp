/**
 * Created by tonimas on 12/12/16.
 */

app.controller('BalanceCtrl', function($scope, $http, $ionicPopup, $stateParams, $rootScope, $timeout, $state,  $cordovaBarcodeScanner) {
    console.log($rootScope.UserID);
    $http.get(base_url + '/anonausers/' + $rootScope.UserID)
      .success(function (res) {
        $scope.user = res;
      })
      .error(function (err) {
        console.log(err);
      });

  $scope.scanBarcode = function() {
    $cordovaBarcodeScanner.scan().then(function(imageData) {
      alert(imageData.text);
      console.log("Barcode Format -> " + imageData.format);
      console.log("Cancelled -> " + imageData.cancelled);
    }, function(error) {
      console.log("An error happened -> " + error);
    });
  };

})
