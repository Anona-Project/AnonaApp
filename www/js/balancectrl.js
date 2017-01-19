/**
 * Created by tonimas on 12/12/16.
 */

app.controller('BalanceCtrl', function($scope, $http, $ionicPopup, $stateParams, $rootScope, $timeout, $state, $cordovaBarcodeScanner, $cordovaCamera, $cordovaFile, $base64) {
  /**
   * Initial values
    */

  $scope.PIN = {
    input: ''
  };

  $scope.QRID = {
    id: ''
  };

  $scope.TEMPO = [];

    $http.get(base_url + '/anonausers/' + $rootScope.UserID)
      .success(function (res) {
        $scope.user = res;
      })
      .error(function (err) {
        console.log(err);
      });

  $scope.scanBarcode = function() {
    $cordovaBarcodeScanner.scan().then(function(imageData) {
      //var ReadQR = $base64.decode(imageData.text);
      $scope.QRID.id = imageData.text;
      console.log($scope.QRID.id);
      $scope.showPopup();

      //$state.go('tab.balance-transaction', {obj: ReadQR});
    }, function(error) {
      console.log("An error happened -> " + error);
    });
  };

  $scope.scanBarcodeBuy = function() {
    $cordovaBarcodeScanner.scan().then(function(imageData) {
      console.log("Barcode Format -> " + imageData.format);
      console.log("Cancelled -> " + imageData.cancelled);
      var ReadQR = $base64.decode(imageData.text);
      console.log(ReadQR);
      $state.go('tab.balance-transaction', {obj: ReadQR});
    }, function(error) {
      console.log("An error happened -> " + error);
    });
  };

  $scope.showPopup = function() {

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="number" style="-webkit-text-security: disc" ng-model="PIN.input">',
      title: 'PIN',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Accept</b>',
          type: 'button-positive',
          onTap: function() {
            $scope.getnewCoins();
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log('Tapped! PIN', $scope.PIN.input);
    });
  };

  $scope.getnewCoins = function() {

    $scope.TEMPO = [];
    console.log($scope.user);

    $http.get(base_url + '/anonawallet/temporary/' + $scope.QRID.id)
      .success(function (res) {

        // READ
        $cordovaFile.readAsText(cordova.file.dataDirectory, "keychain.txt")
          .then(function (success) {
            var kcoin = success;

            var decrypted = CryptoJS.AES.decrypt(kcoin, $scope.PIN.input.toString());
            console.log("Salida sin mod DecPass: " + decrypted);
            //Kcoin descifrada -- Libre
            var deckcoin = decrypted.toString(CryptoJS.enc.Latin1);
            console.log('Final:' + deckcoin);

            var check = deckcoin.split("-");
            console.log(check[0]);
            if (check[0].localeCompare("CORRECT") == 0)
            {
              //Listado de monedas
              //[0] necessario para eliminar el objeto
              $scope.TEMPO = res[0];

              console.log($scope.TEMPO);

              angular.forEach($scope.TEMPO.ecoins, function (c, index) {
                console.log(c);

                var string = JSON.stringify(c);

                var encrypted = CryptoJS.AES.encrypt(string, check[1]);
                var c1 = encrypted.toString();
                console.log("Coin Cifrada: " + c1);

                var coinw = {};
                coinw.userid = $scope.user._id;
                coinw.string = c1;

                $http.post(base_url + '/anonawallet/coin/', coinw)
                  .success(function (res) {
                    $http.get(base_url + '/anonausers/' + $rootScope.UserID)
                      .success(function (res) {
                        $scope.user = res;
                      })
                      .error(function (err) {
                        console.log(err);
                      });
                  })
                  .error(function (err) {
                    console.log(err);
                  });
              });
            }
            else{
              $ionicPopup.alert({
                title: 'Error',
                template: 'Incorrect PIN'
              });
            }
          });
          }, function (error) {
            // error
          });
  };

})
