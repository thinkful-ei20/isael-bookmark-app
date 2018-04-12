'use strict';
const Store = (function(){
  
  const store = [];

  const addBookmark = function(bookmark){
    this.store.push(bookmark);
  };

  const deleteBookmark = function(id){
    this.store = this.store.filter(bookmark => id !== bookmark.id);
  };

  const updateBookmark = function(id, dataObj){

  };

  return {
    store,
    addBookmark,
    deleteBookmark,
  };

}());