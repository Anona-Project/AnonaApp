/**
 * Created by tonimas on 12/12/16.
 */

app.controller('TransactionDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
