'use strict';
const Store = (function(){
  
  const store = [];

  const addBookmark = function(bookmark){
    bookmark.isClicked = false;
    this.store.push(bookmark);
  };

  const deleteBookmark = function(id){
    this.store = this.store.filter(bookmark => id !== bookmark.id);
  };

  const updateBookmark = function(id, dataObj){
    let bookmark = this.store.find(bookmark => bookmark.id === id);
    Object.assign(bookmark, dataObj);
  };

  const isClicked = function(id){
    this.store.forEach(bookmark => {
      if(id === bookmark.id)  bookmark.isClicked = !bookmark.isClicked;
    });
  };

  return {
    store,
    addBookmark,
    deleteBookmark,
    isClicked,
    updateBookmark,
  };

}());