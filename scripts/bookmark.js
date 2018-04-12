'use strict';
const Bookmark = (function(){
  
  const genereatehtmlString = function(bookmark){
    return `
      <div>
      
      </div>
    `;
  };

  const generateBookmarks = function(arr){
    const bookmarks = arr.map(bookmark => genereatehtmlString(bookmark));
    return bookmarks;
  };

  const render = function(){
    let bookmarks = Store.store;

    let html = generateBookmarks(bookmarks);

    $('#result').html(html);
  };

  const initialize = function(){
    Api.getBookmarks(response => {
      response.forEach(bookmark => Store.addBookmark(bookmark));
      render();
    });
  };

  const valReset = function(){
    $('#create-title').val('');
    $('#create-url').val('https://');
    $('#create-desc').val('');
    $('#create-rating').val('');
  };

  const createBookmarkListener = function(){
    $('#create-new-bookmark').on('submit', e => {
      e.preventDefault();
      
      let title = $('#create-title').val();
      let url = $('#create-url').val();
      let desc = $('#create-desc').val() === undefined ? '' :  $('#create-desc').val();
      let rating = $('#create-rating').val() === '' ? 1 : $('#create-rating').val();

      const data = {
        title, 
        url, 
        desc,
        rating
      };

      valReset();

      Api.addBookmark(data, response => {
        Store.addBookmark(response);
        render();
      });
    });
  };

  const bindFunc = function(){
    initialize();
    createBookmarkListener();
  };

  return {
    render,
    bindFunc,
  };

}());