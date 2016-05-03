/**
 * Created by kris on 2/23/16.
 */
angular.module('favServices', [])

  .service('Favs', favService);

favService.$inject=["userService"];

function favService(userService){
  var fs = this;

  var ref = new Firebase("https://storeappformatc.firebaseio.com");
  var usersRef = ref.child("users");

  fs.favsArray = [];

  fs.addFav = addFav;
  fs.remFav = remFav;
  fs.returnFav=returnFav;

  function addFav(product) {
    var invalid = false;
    for(var i=0;i<fs.favsArray.length;i++) {
      if(fs.favsArray[i].itemId==product.itemId) {
        invalid=true;
        console.log("Tried to block")
      }
      //console.log(fs.favsArray[i]);
    }
    if(!invalid){
      console.log("We're Adding a favorite!!!!", product);
      fs.favsArray.push(product);
      userService.storeFavs(product);
      //console.log(userService.getFavs());
    }
  }
  function remFav(product) {
    var index = fs.favsArray.indexOf(product);
    userService.removeFav(product.name);
    fs.favsArray.splice(index, 1);
  }

  function returnFav(){
    return fs.favsArray;
  }

}
