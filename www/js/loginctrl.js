/**
 * Created by tonimas on 12/12/16.
 */

app.controller('LoginCtrl', function($scope, $http, $ionicPopup, $stateParams, $rootScope, $timeout, $state) {


  var pass = CryptoJS.lib.WordArray.random(256);
  var passString = CryptoJS.enc.Latin1.stringify(pass);

  function convertToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
      hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
  }

  var passPhrase = convertToHex(passString);
  console.log(passPhrase);


  var encrypted = CryptoJS.AES.encrypt("Hola", passPhrase, { mode: CryptoJS.mode.CTR});
  var decrypted = CryptoJS.AES.decrypt(encrypted, passPhrase, { mode: CryptoJS.mode.CTR});

  console.log('encrypted', encrypted);
  console.log('decrypted', decrypted.toString(CryptoJS.enc.Utf8));


  console.log();

  $scope.user = {};
  $scope.Login = function () {
    $http.post(base_url + '/anonausers/login', $scope.user)
      .success(function (res) {
        console.log(res);
        $rootScope.UserID = res;
        $state.go('tab.balance');
      })
      .error(function (err) {
        $ionicPopup.alert({
          title: 'Error',
          template: 'Incorrect credentials'
        });
      });
  };

  $scope.Register = function () {
    $state.go('register')
  };

})
