'use strict';
const Api = (function(){
  
  const URL = 'https://thinkful-list-api.herokuapp.com/isael/bookmarks';

  const getBookmarks = function(callback, error){
    const options = {
      url: URL,
      method: 'GET',
      contentType: 'application/json',
      success: callback,
      error: error,
    };

    $.ajax(options);
  };
  //Api.getBookmarks(response => response.forEach(item => Store.addBookmark(item)));

  const addBookmark = function(dataObj, callback, error){
    let data = JSON.stringify(dataObj);

    const options = {
      url: URL,
      method: 'POST',
      contentType: 'application/json',
      data: data,
      success: callback, 
      error: error
    };

    $.ajax(options);
  };

  //Api.addBookmark({title: 'isaellizama', url: 'https://isaellizama.com'}, response => console.log(response));
  const updateBookmark = function(id, dataObj, callback, error){
    let data = JSON.stringify(dataObj);
    
    const options ={
      url: `${URL}/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: data,
      success: callback,
      error: error,
    };

    $.ajax(options);
  };
  //Api.updateBookmark("cjfwqnvq9000y0kz5rd7tx988", {rating: 2, desc: "hello"}, response => console.log(response));

  const deleteBookmark = function(id, callback, error){
    const options = {
      url: `${URL}/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      success: callback,
      error: error,
    };
    $.ajax(options);
  };

  return {
    getBookmarks,
    updateBookmark,
    deleteBookmark,
    addBookmark,
  };

}());