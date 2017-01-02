/**
 * Created by tonimas on 12/12/16.
 */

app.controller('LoginCtrl', function($scope, $http, $ionicPopup, $stateParams, $rootScope, $timeout, $state) {

  $scope.user = {};
  $rootScope.kcoin = {};

  $scope.Login = function () {

    $http.post(base_url + '/anonausers/login', $scope.user)
      .success(function (res) {
        console.log(res);
        $rootScope.UserID = res;

        $http.get(base_url + '/anonausers/' + $rootScope.UserID)
          .success(function (res) {
            var decrypted = CryptoJS.AES.decrypt(res.kcoin, $scope.user.password);
            console.log("Salida en (UTF-8): " + decrypted);
            var dec = decrypted.toString(CryptoJS.enc.Utf8);
            console.log("Post UTF-8 (Base64): " + dec);

            $rootScope.kcoin = dec;
          })
          .error(function (err) {
            console.log(err);
          });

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
