'use strict';
const Bookmark = (function(){
  
  const genereatehtmlString = function(bookmark){
    let rating = bookmark.rating === null ? 1 : bookmark.rating;
    let desc = bookmark.desc === null ? `describe ${bookmark.title}` : bookmark.desc;
    return `
      <div class="bookmark-card" data-id="${bookmark.id}">
        <h3>Title: ${bookmark.title}<h3>
        <h3>${rating}</h3>
        
        <p>${desc}</p>
        <a href="${bookmark.url}"><button type="button">Visit</button></a>
        <button class="delete">Delete ${bookmark.title}</button>
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

  const deleteBookmarkListener = function(){
    $('#result').on('click', '.delete', e => {
      let id = $(e.target).closest('.bookmark-card').data('id');

      Api.deleteBookmark(id, response => {
        Store.deleteBookmark(id);
        render();
      });

      //console.log(id);
    });
  };

  const bindFunc = function(){
    initialize();
    createBookmarkListener();
    deleteBookmarkListener();
  };

  return {
    render,
    bindFunc,
  };

}());