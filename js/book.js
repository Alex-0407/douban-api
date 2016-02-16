(function() {
  var id = parseInt(window.location.hash.substr(1));
  $.ajax({
    url: "https://api.douban.com/v2/book/" + id,
    type: 'GET',
    dataType: 'jsonp',
    success: function(resultJSON) {
      $('.search-loading').addClass('hide');
      $('.page-title').removeClass('hide');
      $('.page-info-container').removeClass('hide');
      $('.author-intro').removeClass('hide');

      $('#page-title').html(resultJSON.title);
      $('#page-author').html(resultJSON.author);
      $('#page-publisher').html(resultJSON.publisher);
      $('#page-translator').html(resultJSON.translator.join(' / '));
      $('#page-pubdate').html(resultJSON.pubdate);
      $('#page-pages').html(resultJSON.pages);
      $('#page-price').html(resultJSON.price);
      $('#page-binding').html(resultJSON.binding);
      $('#page-series').html(resultJSON.series.title);
      $('#page-isbn').html(resultJSON.isbn13);

      var pageImg = new Image();
      pageImg.src = resultJSON.images.large;
      pageImg.setAttribute('class', 'page-img');
      pageImg.setAttribute('alt', resultJSON.title);
      $('.page-img-container').append(pageImg);

      $('#comment-numRaters').html(resultJSON.rating.numRaters);
      $('#score-show').html(resultJSON.rating.average);

      var starGroup = $('#star-group');
      var score2star = parseInt(resultJSON.rating.average);
      for (var i = 0; i <= 4; i++) {
        // mark star to show the score
        var tmp = $('<i></i>');
        if (score2star >= 1.5) tmp.attr('class', 'fa fa-star');
        else if (score2star >= 0.5) tmp.attr('class', 'fa fa-star-half-o');
        else tmp.attr('class', 'fa fa-star-o');
        starGroup.append(tmp);
        score2star -=2;
      }
    }
  })
})()