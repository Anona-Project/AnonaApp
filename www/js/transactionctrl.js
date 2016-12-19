/**
 * Created by tonimas on 19/12/16.
 */

app.controller('TransactionCtrl', function($scope, $stateParams, $state, $ionicPopup,$timeout) {
  $scope.data = JSON.parse($state.params.obj);
  console.log($scope.data);

  $scope.Office = {
    selected:'Barcelona - Sants'
  };

    // Triggered on a button click, or some other target
    $scope.ConfirmOrder = function() {
      $scope.data = {};

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="number" style="-webkit-text-security: disc" ng-model="data.pin">',
        title: 'Confirm order',
        subTitle: 'Type your PIN',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Pay</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.pin) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                console.log($scope.data.pin);
              }
            }
          }
        ]
      });

      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
    };

})
