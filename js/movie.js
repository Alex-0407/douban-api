(function() {
  var id = parseInt(window.location.hash.substr(1));
  $.ajax({
    url: "https://api.douban.com/v2/movie/" + id,
    type: 'GET',
    dataType: 'jsonp',
    success: function(resultJSON) {
      $('.search-loading').addClass('hide');
      $('.page-title').removeClass('hide');
      $('.page-info-container').removeClass('hide');
      $('.intro').removeClass('hide');

      if (resultJSON.title) $('#page-title').html(resultJSON.title);
      else $('#page-title-li').remove();
      if (resultJSON.attrs.director) $('#page-director').html(resultJSON.attrs.director.join(' / '));
      else $('#page-director-li').remove();
      if (resultJSON.attrs.writer) $('#page-weiter').html(resultJSON.attrs.writer.join(' / '));
      else $('#page-weiter-li').remove();
      if (resultJSON.attrs.cast) $('#page-cast').html(resultJSON.attrs.cast.join(' / '));
      else $('#page-cast-li').remove();
      if (resultJSON.attrs.movie_type) $('#page-type').html(resultJSON.attrs.movie_type.join(' / '));
      else $('#page-type-li').remove();
      if (resultJSON.attrs.country) $('#page-country').html(resultJSON.attrs.country.join(' / '));
      else $('#page-country-li').remove();
      if (resultJSON.attrs.language) $('#page-language').html(resultJSON.attrs.language.join(' / '));
      else $('#page-language-li').remove();
      if (resultJSON.attrs.pubdate) $('#page-pubdate').html(resultJSON.attrs.pubdate[0]);
      else $('#page-pubdate-li').remove();
      if (resultJSON.attrs.movie_duration) $('#page-duration').html(resultJSON.attrs.movie_duration[0]);
      else $('#page-duration-li').remove();
      if (resultJSON.alt_title) $('#page-altname').html(resultJSON.alt_title);
      else $('#page-altname-li').remove();

      var pageImg = new Image();
      pageImg.src = resultJSON.image;
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

      $('#intro').html(resultJSON.summary);

      if ($('body').height() < $(window).height()) {
        $('.footer').css('margin-top', $(window).height()-$('body').height());
      }
    }
  })
})()