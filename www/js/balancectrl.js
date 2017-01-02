/**
 * Created by tonimas on 12/12/16.
 */

app.controller('BalanceCtrl', function($scope, $http, $ionicPopup, $stateParams, $rootScope, $timeout, $state,  $cordovaBarcodeScanner, $cordovaCamera, $base64) {
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
      //var ReadQR = $base64.decode(imageData.text);
      $scope.QRID.id = imageData.text;
      console.log($scope.QRID.id);
      $scope.showPopup();

      //$state.go('tab.balance-transaction', {obj: ReadQR});
    }, function(error) {
      console.log("An error happened -> " + error);
    });
  };


  $scope.showPopup = function() {

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template:
      '<div class="item item-input-inset">'+
      '<label class="item-input-wrapper">'+
      '<input type="tel" ng-model="PIN.input">'+
      '</label>'+
      '</div>',
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

        var decrypted = CryptoJS.AES.decrypt($rootScope.kcoin, $scope.PIN.input);
        console.log("Salida sin mod DecPass: " + decrypted);
        //Kcoin descifrada -- Libre
        var deckcoin = decrypted.toString(CryptoJS.enc.Latin1);
        console.log('Final:'+ deckcoin);

        //Listado de monedas
        //[0] necessario para eliminar el objeto
        $scope.TEMPO = res[0];

        console.log($scope.TEMPO);

       angular.forEach($scope.TEMPO.ecoins, function(c, index){
          console.log(c);

          $http.post(base_url + '/anonabank/coin/', c)
            .success(function (res) {

              var encrypted = CryptoJS.AES.encrypt(res._id, deckcoin);
              var c1 = encrypted.toString();
              console.log("Coin Cifrada: " + c1);

              var coinw = {};
              coinw.userid = $scope.user._id;
              coinw.coinid = c1;

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
            })
            .error(function (err) {
              console.log(err);
            });

        });

      })
      .error(function (err) {
        console.log(err);
      });
  };
})
