/**
 * Created by wesleyyoung1 on 2/16/16.
 */
(function(){
  'use strict';

  angular.module('AcctCtrl', [])
    .controller('AccountCtrl', acctCont);

  acctCont.$inject = ["$scope" , "$ionicPopup", "userService", "$ionicModal", "$http"];
  function acctCont($scope, $ionicPopup, userService, $ionicModal, $http){

    var ac = this;
    //Commit worked #1

    //Firebase URL
    var ref = new Firebase("https://storeappformatc.firebaseio.com");
    var usersRef = ref.child("users");

    //Temporary Get values
    var storage=[];
    ref.on("value", function(keys){
      if(keys.val().users!==undefined){
        storage=keys.val().users;
      }else{
        usersRef.set({users: []});
      }
    }, function(errorObject){
      console.log("The read failed: " + errorObject.code);
    });

    //User State Vars
    ac.isLoggedIn=false;
    ac.isCreatingAcc=false;
    ac.usedGoogle=false;
    ac.showCat=false;
    ac.showBlockedCat=false;
    ac.emptyCat=true;

    //User Info Vars
    ac.email = "";
    ac.password = "";
    ac.name = "";
    ac.validatedEmail="";
    ac.profileImg="";
    ac.thisUser = {};
    ac.newCategory = "";
    ac.newBlockedCategory = "";
    //User lists
    ac.categories = [];
    ac.blockedCategories = [];
    ac.favorites = [];
    ac.cart = [];

    //Function variables
    ac.createAcc=createFireAccount;
    ac.logIn=logIntoFireAccount;
    ac.googleLogin=logInWithGoogle;
    ac.signOut = logOut;
    ac.addCategory = addCat;
    ac.addBlockedCategory=addBlockedCat;
    ac.blockCategory=blockCat;
    ac.removeCategory= removeCat;
    ac.removeBlockedCategory=removeBlockedCat;
    ac.toggleCat=showCategories;
    ac.toggleBlockedCat=showBlockedCategories;

    //Create a new account with FireBase
    function createFireAccount(){
      var fireBaseObj = {};
      console.log(ac.email);
      ref.createUser({
        email    : ac.email,
        password : ac.password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
          $("#err").html(error);
          if(/email/.test(error)){
            $("#emailBox").css("border", "solid red 1px")
          }
          else{
            $("#emailBox").css("border", "solid lightgrey 1px")
          }
          if(/password/.test(error)){
            $("#passBox").css("border", "solid red 1px")
          }
          else{
            $("#passBox").css("border", "solid lightgrey 1px")
          }
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          logIntoFireAccount();
          fireBaseObj[userData.uid]={keywords: ac.categories, blockedKeywords: ac.blockedCategories, favs: []};
          usersRef.set(fireBaseObj);
          userService.changeLogInState(true, false);
        }
      });
    }
    //Log users into their FireBase account
    function logIntoFireAccount(){
      ref.authWithPassword({
        email    : ac.email,
        password : ac.password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          $("#err").html(error);
          if(/email/.test(error)){$("#emailBox").css("border-bottom", "solid red 1px")}
          else{$("#emailBox").css("border-bottom", "solid lightgrey 1px")}
          if(/password/.test(error)){$("#passBox").css("border-bottom", "solid red 1px")}
          else{$("#passBox").css("border-bottom", "solid lightgrey 1px")}
        } else {
          ref.on("value", function(keys){
            if(keys.val().users!==undefined){
              storage=keys.val().users;
            }else{
              //usersRef.set({users: []});
            }
          }, function(errorObject){
            console.log("The read failed: " + errorObject.code);
          });
          $scope.$apply(function(){
            ac.isLoggedIn=true;
            ac.validatedEmail = ac.email;
            ac.thisUser = authData;
            ac.profileImg=authData.password.profileImageURL;
            if(storage[authData.uid]!==undefined){
              if(storage[authData.uid].keywords!==undefined){
                ac.categories=storage[authData.uid].keywords;
                userService.storeKeys(ac.categories);
                if(storage[authData.uid].keywords.length>0) {
                  ac.showCat=false;
                }
              }
              ac.favorites=userService.getFavs();
              //if(storage[authData.uid].favs!==undefined){
              //
              //  ac.favorites = storage[authData.uid].favs;
              //}
              if(storage[authData.uid].blockedKeywords!==undefined){
                ac.blockedCategories=storage[authData.uid].blockedKeywords;
              }else{
                ac.blockedCategories=[];
              }
            }
          });
          userService.changeLogInState(true, false);
          userService.getFavs();
          updateFireBase();
          $("#passBox").css("border-bottom", "solid lightgrey 1px");
          $("#emailBox").css("border-bottom", "solid lightgrey 1px");
          console.log("Authenticated successfully with payload:", authData);
        }
      });
    }
    //Allow users to log in using Google
    function logInWithGoogle(){
      ref.authWithOAuthPopup("google", function(error, authData) {
        console.log(authData.google);
        if (error) {
          console.log("Login Failed!", error);
        } else {
          $scope.$apply(function(){
            ac.isLoggedIn=true;
            ac.validatedEmail = authData.google.displayName;
            ac.profileImg=authData.google.profileImageURL;
            ac.thisUser=authData.google;
            ac.usedGoogle=true;
            if(storage[authData.id]!==undefined){
              if(storage[authData.id].keywords!==undefined){
                ac.categories=storage[authData.id].keywords;
                userService.storeKeys(ac.categories);
                if(storage[authData.id].keywords.length>0) {
                  ac.showCat=false;
                }
              }
              if(storage[authData.id].favs!==undefined){
                ac.favorites = storage[authData.id].favs;
              }
              if(storage[authData.id].blockedKeywords!==undefined){
                ac.blockedCategories=storage[authData.id].blockedKeywords;
              }else{
                ac.blockedCategories=[];
              }
            }
            userService.changeLogInState(true, true);
          });
          //$state.go("tab.account");
        }
      })
    }
    //Log users out of their account
    function logOut(){
      ac.email = "";
      ac.password = "";
      ac.name = "";
      ac.validatedEmail="";
      ac.profileImg="";
      ac.categories=[];
      ac.blockedCategories=[];
      ac.isLoggedIn=false;
      ac.isCreatingAcc=false;
      ac.usedGoogle=false;
      ac.showCat = false;
      ac.emptyCat = true;
      userService.changeLogInState(false);
      userService.storeKeys(ac.categories);
    }
    //Add Categories into the user categories array
    function addCat(){
      var invalid = false;
      for(var i=0;i<ac.categories.length;i++){
        if(ac.newCategory.toUpperCase()==ac.categories[i].key.toUpperCase()){
          invalid=true;
        }
      }
      if(ac.newCategory==""||ac.newCategory.length>15){
        invalid=true;
      }
      if(!invalid){
        ac.categories.push({key: ac.newCategory, id: ac.categories.length});
        ac.newCategory="";
        $("#newCategoryInput").css("border", "solid white 1px");
        updateFireBase();
      }
      else{
        $("#newCategoryInput").css("border", "solid red 1px")
      }
      if(ac.categories.length>0){
        ac.emptyCat=false;
      }
    }
    function removeCat(id){
      for(var i=0;i<ac.categories.length;i++){
        if(id==ac.categories[i].id){
          ac.categories.splice(i, 1)
        }
      }
      updateFireBase();
    }
    function blockCat(id){
      for(var i=0;i<ac.categories.length;i++){
        if(id==ac.categories[i].id){
          ac.blockedCategories.push(ac.categories[i]);
          ac.categories.splice(i, 1)
        }
      }
      updateFireBase();
    }
    function addBlockedCat(){
      var invalid = false;
      for(var i=0;i<ac.blockedCategories.length;i++){
        if(ac.newBlockedCategory.toUpperCase()==ac.blockedCategories[i].key.toUpperCase()){
          invalid=true;
        }
      }
      if(ac.newBlockedCategory==""||ac.newBlockedCategory.length>15){
        invalid=true;
      }
      if(!invalid){
        ac.blockedCategories.push({key: ac.newBlockedCategory, id: ac.blockedCategories.length});
        ac.newBlockedCategory="";
        $("#newBlockedCategoryInput").css("border", "solid white 1px");
        updateFireBase();
      }
      else{
        $("#newBlockedCategoryInput").css("border", "solid red 1px")
      }
      if(ac.categories.length>0){
        ac.emptyCat=false;
      }
    }
    function removeBlockedCat(id){
      for(var i=0;i<ac.blockedCategories.length;i++){
        if(id==ac.blockedCategories[i].id){
          ac.blockedCategories.splice(i, 1)
        }
      }
      updateFireBase();
    }
    function showCategories(){
      ac.showCat?ac.showCat=false:ac.showCat=true;
      ac.showCat?$("#toggleCat").html("Hide Categories"):$("#toggleCat").html("Show Categories");
    }
    function showBlockedCategories(){
      ac.showBlockedCat?ac.showBlockedCat=false:ac.showBlockedCat=true;
      ac.showBlockedCat?$("#toggleBlockedCat").html("Hide Categories"):$("#toggleBlockedCat").html("Show Categories");
    }

    //Form validation
    $("body").keyup(function () {
      if(!ac.isLoggedIn){
        var email = $("#emailBox > input").val();
        var password = $("#passBox > input").val();
        var error="";
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(email.length>=12&&!re.test(email)&&$('input:focus').val()==email){
          $("#emailBox").css("border-bottom", "solid red 1px");
        }else{
          $("#emailBox").css("border-bottom", "solid lightgrey 1px")
        }
        if($('input:focus').val()==password&&!re.test(email)&&password!=""){
          error="Please enter a valid email before entering your password";
          $("#emailBox").css("border-bottom", "solid red 1px");
        }else{
          error="";
        }
        $("#err").html(error);
      }
    });
    $("#emailBox > input").keyup(function(){
      console.log("Yes!");
    });

    function updateFireBase(){
      var fireBaseObj={};
      for(var i=0;i<ac.blockedCategories.length;i++){
        ac.blockedCategories[i].id=i;
        delete ac.blockedCategories[i].$$hashKey
      }
      for(var i=0;i<ac.categories.length;i++){
        ac.categories[i].id=i;
        delete ac.categories[i].$$hashKey
      }
      ac.usedGoogle?fireBaseObj[ac.thisUser.id]={keywords: ac.categories, blockedKeywords: ac.blockedCategories, favs: ac.favorites}:fireBaseObj[ac.thisUser.uid]={keywords: ac.categories, blockedKeywords: ac.blockedCategories, favs: ac.favorites};
      userService.storeKeys(ac.categories);
      userService.storeBlockedKeys(ac.blockedCategories);
      userService.storeUser(ac.thisUser);
      usersRef.update(fireBaseObj);
    }


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
