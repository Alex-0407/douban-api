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
      $('.intro').removeClass('hide');

      if (resultJSON.title) $('#page-title').html(resultJSON.title);
      else $('#page-title-li').remove()
      if (resultJSON.author) $('#page-author').html(resultJSON.author);
      else $('#page-author-li').remove()
      if (resultJSON.publisher) $('#page-publisher').html(resultJSON.publisher);
      else $('#page-publisher-li').remove()
      if (resultJSON.translator) $('#page-translator').html(resultJSON.translator.join(' / '));
      else $('#page-translator-li').remove()
      if (resultJSON.pubdate) $('#page-pubdate').html(resultJSON.pubdate);
      else $('#page-pubdate-li').remove()
      if (resultJSON.pages) $('#page-pages').html(resultJSON.pages);
      else $('#page-pages-li').remove()
      if (resultJSON.price) $('#page-price').html(resultJSON.price);
      else $('#page-price-li').remove()
      if (resultJSON.binding) $('#page-binding').html(resultJSON.binding);
      else $('#page-binding-li').remove();
      if (resultJSON.series) $('#page-series').html(resultJSON.series.title);
      else $('#page-series-li').remove();
      if (resultJSON.isbn13) $('#page-isbn').html(resultJSON.isbn13);
      else if (resultJSON.isbn10) $('#page-isbn').html(resultJSON.isbn10);
      else $('#page-isbn-li').remove();

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

      $('#author-intro').html(resultJSON.author_intro);

      if ($('body').height() < $(window).height()) {
        $('.footer').css('margin-top', $(window).height()-$('body').height());
      }
      else {
        if (parseInt($('.footer').css('margin-top')) < ($('body').height() - $(window).height())) $('.footer').css('margin-top', 0);
        else $('.footer').css('margin-top', parseInt($('.footer').css('margin-top') - ($('body').height() - $(window).height())));
      }
    }
  })
})()