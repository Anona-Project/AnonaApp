/**
 * Created by tonimas on 12/12/16.
 */

app.controller('RegisterCtrl', function($scope, $http, $ionicPopup, $stateParams, $rootScope, $timeout, $state) {

  $scope.user = {};
  $scope.Register = function () {
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

})
