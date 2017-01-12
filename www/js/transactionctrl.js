/**
 * Created by tonimas on 19/12/16.
 */

app.controller('TransactionCtrl', function($scope, $stateParams,$rootScope, $state, $ionicPopup,$timeout, $http) {
  $scope.data = JSON.parse($state.params.obj);
  console.log($scope.data);

  $scope.Office = {
    selected:'Barcelona - Sants'
  };

  $scope.checkmoney = {
    userid: $rootScope.UserID,
    price: $scope.data.amount
  };


    // Triggered on a button click, or some other target
    $scope.ConfirmOrder = function() {
      //Obtainig the coins that we need
    $http.post(base_url + '/anonawallet/checkmoney', $scope.checkmoney)
      .success(function(data){
         var money = data; //clear the form
         console.log('monedicas que me llegan', money);
        // put the oin to process and decyprt money
        $scope.info = {
          pin: ''
        };
        var myPopup = $ionicPopup.show({
          template: '<input type="number" style="-webkit-text-security: disc" ng-model="info.pin">',
          title: 'Confirm order',
          subTitle: 'Type your PIN',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Pay</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.info.pin) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  console.log('estoy en el click de pay');

                  //When i put the correct pin decrypt the kcoin
                  console.log('pin',$scope.info.pin);
                  console.log('kcoin',$rootScope.kcoin);
                  var decrypted = CryptoJS.AES.decrypt($rootScope.kcoin, $scope.info.pin.toString());
                  console.log("Salida sin mod DecPass: " + decrypted);

                  //Kcoin descifrada -- Libre
                  var deckcoin = decrypted.toString(CryptoJS.enc.Latin1);
                  console.log('Final:'+ deckcoin);

                  //Recorremos las monedas y las desencriptamos
                  angular.forEach(money, function (c, index) {
                    console.log(c);
                    $http.post(base_url + '/anonabank/coin/', c)
                      .success(function (res) {
                    var decryptedcoin = CryptoJS.AES.decrypt(res._id, deckcoin);
                    var c1 = decryptedcoin.toString();
                    console.log("Coin descifrada: " + c1);

                      }).error(function (err) {

                    });
                    });
                }
              }
            }
          ]
        });
        myPopup.then(function(res) {
          console.log('Tapped!', res);
        });
    }).error(function(data){
        console.log('Error:' + data);
    });
    };

})
