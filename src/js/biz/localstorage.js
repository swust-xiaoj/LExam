/**
 * @file The module of localstorage
*/

define([],function(require) {
    return {
      lsItem :function(name,value){
          var getVal =null;
          if(window.localStorage){
              if(value){
                  localStorage.setItem(name,value);
                  getVal =value;
              }else{
                  getVal =localStorage.getItem(name);
              }
          }else{
              alert("This browser does not support localStorage!");
          }
          return getVal;
      },


      lsRemoveItem:function(name){
          if(window.localStorage){
              localStorage.removeItem(name);
          }else{
              alert("This browser does not support localStorage!");
              return false;
          }
          return true;
      },

      lsRemoveItems:function() {
          var getKeys = arguments;
          for(var i=0; i<getKeys.length; i++){
              this.lsRemoveItem(getKeys[i]);
          }
      }

    }

})
