/**
 * Created by tonimas on 19/12/16.
 */

app.controller('TransactionCtrl', function($scope, $stateParams,$rootScope, $state, $ionicPopup,$timeout, $http, $cordovaFile) {
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

                  // READ the kcoin from file
                  $cordovaFile.readAsText(cordova.file.dataDirectory, "keychain.txt")
                    .then(function (success) {
                      var kcoin = success;

                      //When i put the correct pin decrypt the kcoin
                      console.log('pin', $scope.info.pin);
                      console.log('kcoin', kcoin);

                      //Desciframos la kcoin
                      var decrypted = CryptoJS.AES.decrypt(kcoin, $scope.info.pin.toString());
                      console.log("Salida sin mod DecPass: " + decrypted);

                      //Kcoin descifrada -- Libre
                      var deckcoin = decrypted.toString(CryptoJS.enc.Latin1);
                      console.log('Final:' + deckcoin);

                      //Chekeamos que la moneda este ok
                      var check = deckcoin.split("-");
                      console.log(check[0]);
                      if (check[0].localeCompare("CORRECT") == 0) {
                        //creamos el vector para almazenar todas las monedas
                        var coins = [];
                        //Recorremos las monedas y las desencriptamos
                       for (var i = 0; i < money.length; i++) {
                          console.log('check', check[1]);
                          //Desencriptamos la moneda
                          var decryptedcoin = CryptoJS.AES.decrypt(money[i], check[1]);
                          //Moneda traducida
                          var obtainedcoin = decryptedcoin.toString(CryptoJS.enc.Latin1);
                          console.log('Final:' + obtainedcoin);
                          //Convertimos a json
                          var obtainedcoinjson = JSON.parse(obtainedcoin);
                          console.log("Coin parsed: ", obtainedcoinjson);
                          //creamos un json con todas las monedas dentro
                          coins.push(obtainedcoinjson);
                        }
                        //hacemos la peticion de compra
                        console.log('end of the foreach');
                        console.log(coins);
                        $scope.transaction ={
                          coins: coins,
                          office: $scope.Office.selected,
                          product: $scope.data.productName,
                          price: coins.length
                        };
                        console.log($scope.transaction);
                        //Sending the petition
                        $http.post(base_url + '/anonabank/pay', $scope.transaction)
                          .success(function (res) {
                            console.log('success');
                          })
                          .error(function (err) {
                            console.log(err);
                          });
                      }else{
                        $ionicPopup.alert({
                          title: 'Error',
                          template: 'Incorrect PIN'
                        });
                      }
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
