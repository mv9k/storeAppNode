/**
 * Created by kris on 2/23/16.
 */
(function(){
  'use strict';

  angular.module('favCtrl', [])
    .controller('favCtrl', favCont);

  favCont.$inject = ["Favs", "cartService", "Products", "userService", "$ionicLoading", "$scope", "$timeout"];

  function favCont(Favs, cartService, Products, userService, $ionicLoading, $scope, $timeout){
    var fc = this;
    var fs = Favs;

    fc.addFav = addFav;
    fc.remFav = delFav;
    fc.addToCart = sendToCart;
    fc.favsArray = fs.favsArray;

    //Function variables
    fc.getFavs=getFavs;

    function addFav(product) {
      fs.addFav(product);
      console.log(product + ' saved!')
    }

    function sendToCart(product) {
      cartService.addToCart(product);
    }

    function delFav(product) {
      fs.remFav(product);
    }

    function getFavs(){
      if(userService.getLogInState()){
        var userFavs = userService.getFavs();
      }
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
            fs.addFav(data.data.items[0]);
            console.log("Found the product!: ", data.data.items[0]);
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
      if(userService.getLogInState()&&iterations!==undefined&&iterations>0){
        console.log("started");
        retrieve();retrieve();
      }else if(!userService.getLogInState()){
        alert("Please sign in to use this feature");
      }
      Products.get();
    }
    $scope.$on("$ionicView.beforeEnter",function(){
      $timeout(function(){
        if(userService.getLogInState()){
          getFavs();
        }
      });
    });

  }

}());
