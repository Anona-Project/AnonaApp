/**
 * Created by tonimas on 12/12/16.
 */

app.controller('TransactionDetailCtrl', function($scope,$http, $stateParams, $rootScope) {

  $scope.transactionID = ($stateParams.trId);

  $http.get(base_url + '/anonausers/' + $rootScope.UserID)
    .success(function (res) {
      $scope.transactions = res.transactions;
      console.log($scope.transactions);
    })
    .error(function (err) {
      console.log(err);
    });

})
