/**
 * Created by kris on 2/24/16.
 */
(function(){
  'use strict';

  angular.module('ShopCtrl', [])
    .controller('shopCtrl', shopCont);

  shopCont.$inject = ["$timeout", "$scope", "$state", "Products", "$ionicLoading", "Favs", "cartService", "userService", "detailService", "$ionicModal"];

  function shopCont($timeout, $scope, $state, Products, $ionicLoading, Favs, cartService, userService, detailService, $ionicModal){

    $scope.favToggle = false;
    $scope.buyToggle = false;

    var sc = this;
    var fs = Favs;
    var cs = cartService;
    var us = userService;
    var ds = detailService;

    sc.isActive = false;
    sc.listProducts = {items:[]};
    sc.items = [];
    sc.searchText = '';
    sc.activeButton = activateButton;
    sc.addFav = addFavourite;
    sc.getProducts = getProducts;
    sc.addToCart = addToCart;
    sc.remFav = removeFav;
    sc.getAssignedProducts=getAssignedProducts;
    sc.remFav = removeFav;
    sc.getDetail = getDetail;

    function getDetail(product) {
       ds.storeProduct(product);
    }

    function activateButton() {
      sc.isActive = !sc.isActive;
    }

    function getProducts() {
      $ionicLoading.show();
      Products.get(sc.searchText)
        .then(getSuccess, getFail);
    }

    function getSuccess(data) {
      $ionicLoading.hide();
      sc.listProducts = data.data;
      sc.items = data.data.items;
      console.log(data.data.items);
    }

    function getFail(data) {
      $ionicLoading.hide();
      console.log('error');
    }

    function addFavourite(product) {
      if(us.getLogInState()) {
        fs.addFav(product);
        product.isFav=true;
      }
      else {
        alert('Please sign in to use this feature.')
      }
    }

    function removeFav(product) {
      fs.remFav(product);
    }

    function addToCart(product) {
      $timeout(function(){
        cs.addToCart(product);
      });
      console.log('added '+ product + ' to cart!');
    }

    function getFavs(){
      var userFavs = userService.getFavs();
      //console.log("Here are the favorites for this account", userFavs);
      if(userFavs!==undefined){
        var iterations=userFavs.length;
        //console.log("Init iterations: " + iterations);
        $ionicLoading.show();
      }
      var count=0;
      function retrieve(){
        //console.log("Beginning query for: ", userFavs[count]);
        Products.get(userFavs[count])
          .then(function(data){
            //fs.addFav(data.data.items[0]);
            //console.log("Found the product!: ", data.data.items[0]);
            count++;
            if(count<iterations){
              retrieve();
            }else{
              $ionicLoading.hide();
            }
          }, function(){
            console.log("There was an error retrieving the product: ", userFavs[count]);
            count++;
            if(count<iterations){
              retrieve();
            }else{
              $ionicLoading.hide();
            }
          });
      }
      if(iterations!==undefined&&iterations>0){
        console.log("started");
        retrieve();
      }
      Products.get();
    }

    function getAssignedProducts(){
      getFavs();
      var tempItems=[];
      sc.items=[];
      var count = 0;
      function repeat(){
        var blocked=us.getBlockedKeys();
        Products.get(us.keys[count].key)
          .then(function(data){
            if(data.data.numItems!==0){
              var ourFavs=Favs.returnFav();
              for(var i=0;i<data.data.items.length;i++){
                var isFav=false;
                var isBlocked=false;
                for(var j=0;j<blocked.length;j++){
                  var a = new RegExp(blocked[j].key, "g");
                  if(data.data.items[i]!==undefined){
                    if(a.test(data.data.items[i].name||a.test(data.data.items[i].longDescription))){
                      isBlocked=true;
                    }
                  }
                }
                for(var j=0;j<ourFavs.length;j++){
                  if(ourFavs[j].itemId==data.data.items[i].itemId){
                    isFav=true;
                  }
                }
                if(!isBlocked){
                  data.data.items[i].isFav=isFav;
                  tempItems.push(data.data.items[i]);
                }
              }
            }
            if(count!==(us.keys.length)){
              repeat();
            }
            else{
              $ionicLoading.hide();
            }
          }, function(err){
              console.log("Failure!", err);
              if(count!==(us.keys.length)){
                repeat();
              }
              else{
                $ionicLoading.hide();
              }
          });
        count++;
        sc.items=tempItems;
      }
      if(us.getLogInState()&&us.keys.length>0){
        $ionicLoading.show();
        repeat();
      }else if(userService.getKeys().length==0&&userService.getLogInState()){
        alert("Please assign categories in your account tab.");
        $ionicLoading.hide();
      }
      else {
        alert("Please sign in to use this feature.");
        $ionicLoading.hide();
      }
    }
    if(us.getLogInState()&&us.keys.length>0){
      getAssignedProducts();
    }
    $scope.$on("$ionicView.beforeEnter",function(){
      $timeout(function(){
        if(userService.getLogInState()&&(userService.getKeys().length>0)){
          getFavs();
        }
      });
    });

    /////////////////////// Modal! /////////////////////////

    $ionicModal.fromTemplateUrl('templates/info-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

  }

}());
