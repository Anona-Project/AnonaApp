/**
 * Created by tonimas on 12/12/16.
 */

app.controller('LoginCtrl', function($scope, $http, $ionicPopup, $stateParams, $rootScope, $timeout, $state) {

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
