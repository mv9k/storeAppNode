angular.module('storeApp', [
  'ngAnimate',
  'ngResource',
  'ionic',
  'store.controllers',
  'store.services',
  'cartService',
  'productServices',
  'AcctCtrl',
  'cartModule',
  'tabModule',
  'ShopCtrl',
  'favCtrl',
  'favServices',
  'user.service',
  'detailCtrl',
  'detailService',
  'ngSanitize'
])



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

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      controller: 'tabCtrl as tc'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-shop.html',
          controller: 'shopCtrl as sc'
        }
      }
    })

  .state('tab.cart', {
      url: '/cart',
      views: {
        'tab-cart': {
          templateUrl: 'templates/tab-cart.html',
          controller: 'cartCtrl as cc'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl as ac'
        }
      }
  })

    .state('tab.detail', {
      url: '/dash/:detailId',
      views: {
        'tab-dash': {
          templateUrl: 'templates/product-detail.html',
          controller: 'detailCtrl as dc'
        }
      }
    })

    .state('tab.favs', {
      url: '/favs',
      views: {
        'tab-favs': {
          templateUrl: 'templates/tab-favs.html',
          controller: 'favCtrl as fc'
        }
      }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/account');

});
