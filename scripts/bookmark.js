'use strict';
/*global Store, Api*/ 
const Bookmark = (function(){
  
  const generateCirclesFill = function(val,rating){
    let html = [];

    for(let i = 1; i <= val; i++){
      html.push(`<button class="circles ${rating >= i ? 'rated' : 'unrated'}" data-val="${i}"></button>`);
    }

    return html.join('');
  };


  const genereatehtmlString = function(bookmark){
    let rating = bookmark.rating === null ? 1 : bookmark.rating;
    let desc = bookmark.desc === '' ? `describe ${bookmark.title}` : bookmark.desc;
    let hidden = bookmark.isClicked === true ? '' : 'hidden';
    let circles = generateCirclesFill(5,rating);

    return `
      <div class="bookmark-card" data-id="${bookmark.id}">
        <h3>Title: ${bookmark.title}</h3>
        <section class="rating-section">${circles}</section>
        <button class="view-more">Click to view More</button>
        <div class="hidden-area ${hidden}">
          <form class="change-desc">
            <label for="description">Description:</label>
            <textarea name="description" id="create-desc" cols="30" rows="10">${desc}</textarea>
            <button type="submit">Change Description</button>
          </form>
          <section class="test">
          <a href="${bookmark.url}"><button type="button">Visit Link</button></a>
          <button class="delete">Delete ${bookmark.title}</button>
          </section>
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

  const generateErrMsg = function(message){
    return `<button type="button" class="error-button">${message}</button>`;
  };

  const handleErrMsg = function(){
    $('#error').on('click', '.error-button', e => {
      //console.log(e.target);
      Store.setError('');
      //console.log(Store.errorMessage);
      render();
    });
  };

  const render = function(){
    let bookmarks = Store.store;

    Store.errorMessage !== '' ? $('#error').html(generateErrMsg(Store.errorMessage)) : $('#error').html('');

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
      }, error => {
        Store.setError(error.responseJSON.message);
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
      }, error => {
        Store.setError(error.responseJSON.message);
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
      }, error => {
        Store.setError(error.responseJSON.message);
        render();
      });

      //console.log(id);
    });
  };

  const bookmarkSortListener = function(){
    $('#sort-bookmark').change(e => {
      let val = $('#sort-bookmark').val();
      
      Store.sortBookmarks(val);

      $('#sort-bookmark').val('sort');
    });
  };

  const bookmarkRatingListener = function(){
    $('#result').on('click', '.circles', e => {
      let rating = $(e.target).data('val');
      let id = $(e.target).closest('.bookmark-card').data('id');
      
      let data = {
        rating,
      };

      Api.updateBookmark(id, data, response => {
        Store.updateBookmark(id, data);
        render();
      }, error => {
        Store.setError(error.responseJSON.message);
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
    bookmarkSortListener();
    bookmarkRatingListener();
    handleErrMsg();
  };

  return {
    render,
    bindFunc,
  };

}());