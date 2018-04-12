'use strict';
const Api = (function(){
  
  const URL = 'https://thinkful-list-api.herokuapp.com/isael/bookmarks';

  const getBookmarks = function(callback){
    const options = {
      url: URL,
      method: 'GET',
      contentType: 'application/json',
      success: callback,
    };

    $.ajax(options);
  };
  //Api.getBookmarks(response => response.forEach(item => Store.addBookmark(item)));

  const addBookmark = function(dataObj, callback){
    let data = JSON.stringify(dataObj);

    const options = {
      url: URL,
      method: 'POST',
      contentType: 'application/json',
      data: data,
      success: callback 
    };

    $.ajax(options);
  };
  //Api.addBookmark({title: 'isaellizama', url: 'https://isaellizama.com'}, response => console.log(response));
  const updateBookmark = function(id, dataObj, callback){

  };

  const deleteBookmark = function(id, callback){

  };

  return {
    getBookmarks,
    updateBookmark,
    deleteBookmark,
    addBookmark,
  };

}());