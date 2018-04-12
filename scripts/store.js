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

  const sortBookmarks = function(val){
    if(val === 'minimum'){
      this.store.sort((a , b) => a.rating - b.rating);
      //console.log(this.store);
      Bookmark.render();
    } 
    if(val === 'maximum') {
      this.store.sort((a, b) => b.rating - a.rating);
      //console.log(this.store);
      Bookmark.render();
    }
  };

  return {
    store,
    addBookmark,
    deleteBookmark,
    isClicked,
    updateBookmark,
    sortBookmarks
  };

}());