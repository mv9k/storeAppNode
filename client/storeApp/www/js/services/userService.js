/**
 * Created by wesleyyoung1 on 2/25/16.
 */
angular.module('user.service', [])

.service('userService', userService);

userService.$inject=["$http"];

function userService($http){
  var us=this;

  var ref = new Firebase("https://storeappformatc.firebaseio.com");

  var usersRef = ref.child("users");

  us.keys=[];
  us.blockedKeys=[];
  us.isLoggedIn=false;
  us.favs=[];
  us.favNames=[];
  us.usedGoogle=false;

  //function vars
  us.thisUser={};
  us.storeKeys=storeKeys;
  us.getKeys=getKeys;
  us.changeLogInState=changeLogInState;
  us.storeBlockedKeys=storeBlockedKeys;
  us.getBlockedKeys=getBlockedKeys;
  us.getLogInState=getLogInState;
  us.storeUser=storeUser;
  us.getUser=getUser;
  us.getFavs=getFavs;
  us.storeFavs=storeFavs;
  us.removeFav=removeFav;

  function storeKeys(keys){
    console.log("stored the key!" + keys);
    us.keys=keys;
  }
  function getKeys(){
    return us.keys;
  }
  function storeBlockedKeys(keys){
    us.blockedKeys=keys;
    console.log(us.blockedKeys);
  }
  function getBlockedKeys(){
    return us.blockedKeys;
  }
  function storeFavs(fav){
    var invalid=false;
    for(var i=0;i<us.favs.length;i++){
      if(fav.itemId==us.favs[i].itemId){
        invalid=true;
        console.log("Invalid because: ", fav, us.favs[i].itemId)
      }
    }
    if(!invalid){
      console.log("I wonder if we're updating FireBase...");
      us.favs.push(fav);
      us.favNames.push(fav.name);
      updateFireBase();
    }else{
      console.log("Why didn't we update FireBase? ;(")
    }
  }
  function getFavs(){
    var favs=[];
    var id = us.usedGoogle?us.thisUser.id:us.thisUser.uid;

    $http.get("http://storeappnode-62710.onmodulus.net/favs"+id)
      .then(function(data){
      favs = data.split("*");
    }, function(err){
      console.log(err);
    });
    //ref.on("value", function(keys){
    //  var id = us.usedGoogle?us.thisUser.id:us.thisUser.uid;
    //  if(keys.val().users[id]!==undefined){
    //    favs=keys.val().users[id].favs;
    //    //console.log("Firebase says the favs for this account are: ", keys.val().users[us.thisUser.uid]);
    //  }else{
    //  }
    //}, function(errorObject){
    //  console.log("The read failed: " + errorObject.code);
    //});
    //console.log("This message is to distinguish this console.log", favs);
    return favs;
  }

  function removeFav(id){
    console.log("Attempting to remove....", id, us.favs);
    for(var i=0;i<us.favs.length;i++){
      if(us.favs[i]==id){
        us.favs.splice(i, 1);
      }
    }
    updateFireBase();
  }
  function changeLogInState(state, google){
    us.isLoggedIn=state;
    us.usedGoogle=google;
  }
  function getLogInState(){
    return us.isLoggedIn;
  }
  function storeUser(user){
    us.thisUser=user;
  }
  function getUser(){
    return us.thisUser;
  }

  function updateFireBase(){
    console.log("Updating FireBase");
    var fireBaseObj={};
    var dup=[];
    for(var i=0;i<us.blockedKeys.length;i++){
      us.blockedKeys[i].id=i;
      delete us.blockedKeys[i].$$hashKey
    }
    for(var i=0;i<us.keys.length;i++){
      us.keys[i].id=i;
      delete us.keys[i].$$hashKey
    }
    for(var i=0;i<us.favs.length;i++){
      var reg = new RegExp(us.favs[i].itemId, "g");
      if(dup.length>0){
        if(!dup.split(" ").test(reg)){
          dup.push(us.favs[i].itemId);
        }else{
          console.log("We got here");
          us.favs.splice(i, 1);
          i--;
        }
      }
    }

    //Updating PostGres
    $http.post("http://storeappnode-62710.onmodulus.net/postfavs", {
      id: us.thisUser.id,
      favs: us.favNames
    }).then(function(data){
      console.log("Successfully stored favorites")
    }, function(err){
      console.log(err);
    });

    us.usedGoogle?fireBaseObj[us.thisUser.id]={keywords: us.keys, blockedKeywords: us.blockedKeys, favs: us.favNames}:fireBaseObj[us.thisUser.uid]={keywords: us.keys, blockedKeywords: us.blockedKeys, favs: us.favNames};
    usersRef.update(fireBaseObj);
  }
}
