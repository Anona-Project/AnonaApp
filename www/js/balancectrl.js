/**
 * Created by tonimas on 12/12/16.
 */

app.controller('BalanceCtrl', function($scope, $http, $ionicPopup, $stateParams, $rootScope, $timeout, $state,  $cordovaBarcodeScanner, $cordovaCamera, $base64) {
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
      var ReadQR = $base64.decode(imageData.text);
      console.log(ReadQR);
      $state.go('tab.balance-transaction', {obj: ReadQR});
    }, function(error) {
      console.log("An error happened -> " + error);
    });
  };

})
