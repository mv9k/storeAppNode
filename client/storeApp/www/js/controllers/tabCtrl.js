/**
 * Created by gabed on 3/3/16.
 */
(function(){
  'use strict';

  angular.module('tabModule', [])
    .controller('tabCtrl', tabCtrl);
  tabCtrl.$inject = ['cartService','$scope','$timeout'];
  function tabCtrl(cartService,$scope,$timeout) {
    var tc = this;
    tc.badgeNumber = 5;
  }

})();
