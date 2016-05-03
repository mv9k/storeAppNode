/**
 * Created by kris on 2/25/16.
 */

angular.module('detailCtrl', [])
  .controller('detailCtrl', detailCtrl);

detailCtrl.$inject = ["$stateParams", "detailService", "cartService"];

function detailCtrl($stateParams, detailService, cartService) {

  var dc = this;
  var ds = detailService;
  var cs = cartService;

  dc.addToCart = addToCart;

  dc.product = ds.product;

  function addToCart(product) {
    cs.addToCart(product);
    console.log('added '+ product + ' to cart!');
  }

}
