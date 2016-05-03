/**
 * Created by kris on 2/29/16.
 */

angular.module('detailService', [])
  .service('detailService', detailService);

function detailService() {

  ds = this;
  ds.product = {};
  ds.storeProduct = storeProduct;

  function storeProduct(product) {
    ds.product = product;
  }

}
