'use strict';
/*global Store, Api*/ 
const Bookmark = (function(){
  
  const generateCirclesFill = function(val,rating){
    let html = [];

    for(let i = 1; i <= val; i++){
      //adds the class rated to the buttons with the value below or equal to the rating, and unrated to the buttons with a higher value
      html.push(`<button type="button" class="circles ${rating >= i ? 'rated' : 'unrated'}" data-val="${i}" aria-label="${i} stars rating"></button>`); 
    }

    return html.join('');
  };


  const genereatehtmlString = function(bookmark){ 
    //if rating is empty it gives it a default value if its not it sets its normal value
    let rating = bookmark.rating === null ? 1 : bookmark.rating;
    //if desc is empty it gives it a default value if its not it sets its normal value
    let desc = bookmark.desc === '' ? `describe ${bookmark.title}` : bookmark.desc;
    //if bookmark.isClicked is equal to  true it sets it to an empty string if not it setst the string to hidden
    let hidden = bookmark.isClicked === true ? '' : 'hidden';
    let circles = generateCirclesFill(5,rating);
    //if bookmark.isClicked is equal to  true it sets moreLess the string of Less if its not it sets it to More
    let moreLess = bookmark.isClicked === true ? 'Less' : 'More';

    return `
      <section role="region" class="bookmark-card" data-id="${bookmark.id}">
        <h3>Title: ${bookmark.title}</h3>
        <section role="region" class="rating-section">${circles}</section>
        <button class="view-more">Click to view ${moreLess}</button>
        <section role="region" class="hidden-area ${hidden}">
          <form class="change-desc">
            <label for="description">Description:</label>
            <textarea name="description" class="create-desc" cols="30" rows="10">${desc}</textarea>
            <button type="submit">Change Description</button>
          </form>
          <section role="region" class="bottom-buttons">
          <a href="${bookmark.url}"><button type="button">Visit Link</button></a>
          <button class="delete" type="button">Delete ${bookmark.title}</button>
          </section>
        </section>
      </section>
    `;
  };

  const bookmarkClickGrow = function(){
    $('#result').on('click', '.view-more', e => {
      //grabs the id of the closest bookmark-card
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
    //if  Store.errorMessage is not empty it will run generateErrMsg and set the html of #error to the value
    //if Store.errorMessage is empty it will set #error value to an empty string
    Store.errorMessage !== '' ? $('#error').html(generateErrMsg(Store.errorMessage)) : $('#error').html('');

    let html = generateBookmarks(bookmarks);

    $('#result').html(html);
  };

  const initialize = function(){
    Api.getBookmarks(response => {
      //loops throught the response and add each element with the Store.addBookmark method
      response.forEach(bookmark => Store.addBookmark(bookmark));
      render();
    });
  };

  const valReset = function(){
    $('#create-title').val('');
    $('#create-url').val('https://');
    $('.create-desc').val('');
    $('#create-rating').val('');
  };

  const createBookmarkListener = function(){
    $('#create-new-bookmark').on('submit', e => {
      e.preventDefault();
      
      let title = $('#create-title').val();
      let url = $('#create-url').val();
      let desc = $('.create-desc').val() === undefined ? '' :  $('.create-desc').val();
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
      let desc = $(e.target).find('.create-desc').val();
      
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
    $('#sort-bookmark').change(() => {
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