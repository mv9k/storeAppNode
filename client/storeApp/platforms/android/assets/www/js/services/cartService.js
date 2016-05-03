/**
 * Created by gabed on 2/23/16.
 */
angular.module('cartService', [])

  .service('cartService',cartService);

cartService.$inject=["$http"];


function cartService($http) {
  var cs = this;
  var ionicIs = 'awesome';
  cs.cartProducts = [];
  cs.allCartItems = [];
  cs.actualPrice = Number(0);
  cs.cartItemIds = [];
  cs.totalPriceArr = [];
  cs.totalPrice = totalPrice;
  cs.deleteCurrent = deleteCurrent;
  cs.addToCart = addToCart;
  cs.buyIt = buyIt;

<<<<<<< HEAD:storeApp/platforms/ios/www/js/services/cartService.js
  var options = {
    location: 'yes',
    clearcache: 'yes',
    toolbar: 'yes'
  };

=======
>>>>>>> gmoney:storeApp/platforms/android/assets/www/js/services/cartService.js
  function totalPrice() {

    //console.log('total price array before anything'+cs.totalPriceArr);
    var total = Number(0);
    for (var i = 0; i < cs.cartProducts.length; i++) {
      total += parseFloat(cs.totalPriceArr[i], 10);
    }
    cs.actualPrice = total;
    return cs.actualPrice;
  }


  function buyIt() {
    //window.open('http://c.affil.walmart.com/t/api02?l=http%3A%2F%2Faffil.walmart.com%2Fcart%2FaddToCart%3Fitems%3D' + product.itemId + '%7C1%26affp1%3DM1u8aZZoZbep0p3P7hVn_sT4Ry97xPSOvnILkAKRCH8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi')
    //cs.productLink = '';

    if (cs.cartItemIds.length == 1) {
<<<<<<< HEAD:storeApp/platforms/ios/www/js/services/cartService.js
      window.open("http://c.affil.walmart.com/t/api02?l=http%3A%2F%2Faffil.walmart.com%2Fcart%2FaddToCart%3Fitems%3D" + cs.cartItemIds[0] + "%7C1%26affp1%3DM1u8aZZoZbep0p3P7hVn_sT4Ry97xPSOvnILkAKRCH8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi", '_blank', options);
=======
      window.open("http://c.affil.walmart.com/t/api02?l=http%3A%2F%2Faffil.walmart.com%2Fcart%2FaddToCart%3Fitems%3D" + cs.cartItemIds[0] + "%7C1%26affp1%3DM1u8aZZoZbep0p3P7hVn_sT4Ry97xPSOvnILkAKRCH8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi");
>>>>>>> gmoney:storeApp/platforms/android/assets/www/js/services/cartService.js

    }
    else {
      for (var i = 0; i < (cs.cartItemIds.length - 1); i++) {
        console.log(cs.cartItemIds.length);
        console.log(cs.cartItemIds);
        //alert('http://c.affil.walmart.com/t/api02?l=http%3A%2F%2Faffil.walmart.com%2Fcart%2FaddToCart%3Fitems%3D' + cs.cartItemIds[i]+ '%7C1%26affp1%3DM1u8aZZoZbep0p3P7hVn_sT4Ry97xPSOvnILkAKRCH8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi')
        $http.get("http://c.affil.walmart.com/t/api02?l=http%3A%2F%2Faffil.walmart.com%2Fcart%2FaddToCart%3Fitems%3D" + cs.cartItemIds[i] + "%7C1%26affp1%3DM1u8aZZoZbep0p3P7hVn_sT4Ry97xPSOvnILkAKRCH8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi", {}).storage;
        //window.open('https://www.walmart.com/cart/?affilsrc=api&affp1=M1u8aZZoZbep0p3P7hVn_sT4Ry97xPSOvnILkAKRCH8&wmlspartner=readonlyapi&sourceid=api0298ae3c8c842840409172f10b2bfb579d&veh=aff');

      }
      window.open("http://c.affil.walmart.com/t/api02?l=http%3A%2F%2Faffil.walmart.com%2Fcart%2FaddToCart%3Fitems%3D" + cs.cartItemIds[cs.cartItemIds.length - 1] + "%7C1%26affp1%3DM1u8aZZoZbep0p3P7hVn_sT4Ry97xPSOvnILkAKRCH8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi", '_blank', options);

    }

  }

  //function openWindow(url) {
  //  // make sure you have this: cordova plugin add cordova-plugin-inappbrowser
  //  window.open(url, '_blank', 'location=yes');
  //  return false;
  //}
  function addToCart(product) {
    var invalid = false;
    var productLink = 'http://c.qaffil.walmart.com/t/api02?l=http%3A%2F%2Faffil.walmart.com%2Fcart%2FaddToCart%3Fitems%3D' + product.itemId + '%7C1%26affp1%3DM1u8aZZoZbep0p3P7hVn_sT4Ry97xPSOvnILkAKRCH8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi';
    for (var i = 0; i < cs.cartProducts.length; i++) {
      if (cs.cartProducts[i].itemId == product.itemId) {
        invalid = true;
      }
    }
    if (!invalid) {
      cs.cartProducts.push(product);
      cs.allCartItems.push(productLink);
      cs.cartItemIds.push(product.itemId);
      cs.totalPriceArr.push(product.salePrice);
    }
  }

  function deleteCurrent(currIndex) {
    cs.cartProducts.splice(currIndex, 1);
    cs.totalPriceArr.splice(currIndex, 1);
    totalPrice();
  }
}
