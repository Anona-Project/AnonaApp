/**
 * Created by tonimas on 12/12/16.
 */

app.controller('RegisterCtrl', function($scope, $http, $ionicPopup) {

  $scope.user = {};
  $scope.Register = function () {

    //Creamos un clave aleatoria de
    var pass = CryptoJS.lib.WordArray.random(256);
    var passString = CryptoJS.enc.Base64.stringify(pass);

    //Asignamos un FLAG de verificación
    var flag = "CORRECT";
    var kcoin = flag + '-' + passString;
    console.log(kcoin);
    var check = kcoin.split("-");
    console.log(check[0]);
    console.log(check[1]);


    //Ciframos con el PIN del usuario

    var encrypted = CryptoJS.AES.encrypt(kcoin, $scope.user.pin);
    var e1 = encrypted.toString();
    console.log("E1 to String (Base64): " + e1);

    //Ciframos la kcoin con el password
    //Aplicamos el mismo proceso anterior otra vez

    var encrypted2 = CryptoJS.AES.encrypt(e1, $scope.user.password);
    var e2 = encrypted2.toString();
    $scope.user.e2 = e2;
    console.log("E2 to String (Base64): " + e2);

    $http.post(base_url + '/anonausers/signup', $scope.user)
      .success(function (user) {
        $scope.user = {};
        $ionicPopup.alert({
          title: 'Success',
          template: 'User registred you can login now'
        });
      })
      .error(function (err) {
        $ionicPopup.alert({
          title: 'Error',
          template: 'Incorrect information'
        });
      });
  };

  $scope.showPopup = function() {

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template:
      '<div class="item item-input-inset">'+
      '<label class="item-input-wrapper">'+
      '<input type="tel" ng-model="user.pin">'+
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
            $scope.Register();
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
  };

})
