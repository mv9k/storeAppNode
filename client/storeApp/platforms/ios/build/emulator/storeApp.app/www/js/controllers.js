angular.module('store.controllers', [])
//
//.controller('ShopCtrl', function($scope, Products, $ionicLoading) {
//
//
//  var dc = this;
//
//  dc.listProducts = {items:[]};
//  dc.items = [];
//  dc.searchText = 'bike';
//
//
//  dc.getProducts = function() {
//    console.log('searched --> ' + dc.searchText);
//    console.log(Products.all(dc.searchText));
//
//    $ionicLoading.show();
//      Products.get(dc.searchText)
//        .then(getSuccess, getFail);
//  };
//
//  function getSuccess(data) {
//    $ionicLoading.hide();
//    console.log('success');
//    dc.listProducts = data.data;
//    dc.items = data.data.items;
//    console.log(data.data.items);
//  }
//
//  function getFail(data) {
//    $ionicLoading.hide();
//    console.log('error');
//  }
//})

//.controller('ChatsCtrl', function($scope, Chats) {
//  // With the new view caching in Ionic, Controllers are only called
//  // when they are recreated or on app start, instead of every page change.
//  // To listen for when this page is active (for example, to refresh data),
//  // listen for the $ionicView.enter event:
//  //
//  //$scope.$on('$ionicView.enter', function(e) {
//  //});
//
//  $scope.chats = Chats.all();
//  $scope.remove = function(chat) {
//    Chats.remove(chat);
//  };
//})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('productController', function($scope, Entry) {
  var entry = Entry.get({ id: $scope.id }, function() {
    console.log(entry);
  }); // get() returns a single entry

  var entries = Entry.query(function() {
    console.log(entries);
  }); // query() returns all the entries

})

;

