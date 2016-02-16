(function() {
  var id = parseInt(window.location.hash.substr(1));
  $.ajax({
    url: "https://api.douban.com/v2/music/" + id,
    type: 'GET',
    dataType: 'jsonp',
    success: function(resultJSON) {
      $('.search-loading').addClass('hide');
      $('.page-title').removeClass('hide');
      $('.page-info-container').removeClass('hide');
      $('.intro').removeClass('hide');

      $('#page-title').html(resultJSON.title);
      var authorArr = new Array();
      resultJSON.author.forEach(function(item) {
        authorArr.push(item.name);
      });
      $('#page-singer').html(authorArr.join(' / '));
      if (resultJSON.attrs.version) $('#page-version').html(resultJSON.attrs.version.join(' / '));
      else $('#page-version');
      if (resultJSON.attrs.media) $('#page-media').html(resultJSON.attrs.media);
      else $('#page-media');
      if (resultJSON.attrs.pubdate) $('#page-pubdate').html(resultJSON.attrs.pubdate);
      else $('#page-pubdate');
      if (resultJSON.attrs.publisher) $('#page-publisher').html(resultJSON.attrs.publisher);
      else $('#page-publisher');
      if (resultJSON.attrs.discs) $('#page-discs').html(resultJSON.attrs.discs);
      else $('#page-discs');

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

      if (resultJSON.attrs.songs) {
        var songsArr = new Array();
        resultJSON.attrs.songs.forEach(function(item) {
          songsArr.push(item.index + '. ' + item.title);
        })
        $('#author-intro').html(songsArr.join('<br/>'));
      }
      else {
        $('#author-intro').html('暂无曲目信息');
      }

      if ($('body').height() < $(window).height()) {
        $('.footer').css('margin-top', $(window).height()-$('body').height());
      }
    }
  })
})()