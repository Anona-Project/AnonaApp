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
