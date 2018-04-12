'use strict';
const Bookmark = (function(){
  
  const genereatehtmlString = function(bookmark){
    let rating = bookmark.rating === null ? 1 : bookmark.rating;
    let desc = bookmark.desc === null ? `describe ${bookmark.title}` : bookmark.desc;
    let hidden = bookmark.isClicked === true ? '' : 'hidden';
    return `
      <div class="bookmark-card" data-id="${bookmark.id}">
        <h3>Title: ${bookmark.title}<h3>
        <h3>${rating}</h3>
        <button class="view-more">Click to view More</button>
        <div class="hidden-area ${hidden}">
          <form class="change-desc">
            <label for="description">Description:</label>
            <textarea name="description" id="create-desc" cols="30" rows="10">${bookmark.desc}</textarea>
            <button type="submit">Change Description</button>
          </form>
          <a href="${bookmark.url}"><button type="button">Visit</button></a>
          <button class="delete">Delete ${bookmark.title}</button>
        </div>
      </div>
    `;
  };

  const bookmarkClickGrow = function(){
    $('#result').on('click', '.view-more', e => {
      let id = $(e.target).closest('.bookmark-card').data('id');
      Store.isClicked(id);
      render();
    });
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

  const editBookmarkDesc = function(){
    $('#result').on('submit', '.change-desc', e => {
      e.preventDefault();

      let id = $(e.target).closest('.bookmark-card').data('id');
      let desc = $(e.target).find('#create-desc').val();
      
      let data = {
        desc,
      };
      
      Api.updateBookmark(id, data, response => {
        Store.updateBookmark(id, data);
        render();
      });

      //console.log(id);
    });
  };

  const bindFunc = function(){
    initialize();
    createBookmarkListener();
    deleteBookmarkListener();
    bookmarkClickGrow();
    editBookmarkDesc();
  };

  return {
    render,
    bindFunc,
  };

}());