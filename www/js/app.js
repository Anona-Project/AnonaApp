// Ionic Starter App
var base_url = "http://10.192.254.137:3000";
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic','ngCordova','base64','ja.qr'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position("bottom");
  $stateProvider
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.balance', {
    url: '/balance',
    cache: false,
    views: {
      'tab-balance': {
        templateUrl: 'templates/balance.html',
        controller: 'BalanceCtrl'
      }
    }
  })
    .state('tab.balance-transaction', {
      url: '/balance/transaction',
      params:{obj: null},
      cache: false,
      views: {
        'tab-balance': {
          templateUrl: 'templates/transaction.html',
          controller: 'TransactionCtrl'
        }
      }
    })

  .state('tab.transactions', {
      url: '/transactions',
      cache: false,
      views: {
        'tab-transactions': {
          templateUrl: 'templates/transactions.html',
          controller: 'TransactionsCtrl'
        }
      }
    })
    .state('tab.transactions-detail', {
      url: '/transactions/:trId',
      cache: false,
      views: {
        'tab-transactions': {
          templateUrl: 'templates/transactiondetail.html',
          controller: 'TransactionDetailCtrl'
        }
      }
    })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })
    .state('login', {
      url: '/login',
      cache: false,
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('register', {
      url: '/register',
      cache: false,
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
