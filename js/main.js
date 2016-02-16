(function() {
  var inputType = $('#input-type'),
      searchInput = $('#search-input'),
      typeOptions = $('#type-options'),
      typeOptionsDOM = typeOptions.get(0),
      typeOption = $('.type-option'),
      searchTrigger = $('#searchTrigger'),
      searchRes = $('.search-res'),
      searchLoadingIcon = document.getElementById('search-loading-icon');

  var types = {
    book: '书籍',
    music: '音乐',
    movie: '电影'
  };

  var isLoading = false,
      isOpen = false;

  window.onload = function() {
    footerResize();
  }

  inputType.click(function() {
    changeOptionStatus();
  });

  typeOption.click(function() {
    typeOptions.attr('type', this.getAttribute('value'));
    $('#select-type').html(types[this.getAttribute('value')]);
    changeOptionStatus();
  });

  window.onclick = function() {
    // if the options cantainer is open, close it
    if (typeOptions.attr('status') == 'open') changeOptionStatus();
  }

  function changeOptionStatus() {
    // open or close the options cantainer
    if (isOpen) return -1;
    isOpen = true;
    if (typeOptions.attr('status') == 'close') {
      typeOptions.removeClass('type-options-close-ani');
      typeOptions.removeClass('type-options-close-status');
      typeOptions.addClass('type-options-open-status');
      typeOptions.addClass('type-options-open-ani');
      typeOptions.attr('status', 'open');
    }
    else {
      typeOptions.removeClass('type-options-open-ani');
      typeOptions.removeClass('type-options-open-status');
      typeOptions.addClass('type-options-close-status');
      typeOptions.addClass('type-options-close-ani');
      typeOptions.attr('status', 'close');
    }
  }

  typeOptionsDOM.addEventListener('webkitAnimationEnd', function() {
    this.classList.remove('type-options-' + this.getAttribute('status') + '-ani');
    isOpen = false;
  });

  searchTrigger.click(function() {
    search(searchInput.val());
  });

  document.onkeydown=function(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e && e.keyCode==13) {
      // press key 'enter'
      if (document.activeElement.id !== 'search-input') {
        // not focus on the search-input
        return -1;
      }
      search(searchInput.val());
    }
  };

  function search(str) {
    if (isLoading) return -1;
    if (str == '') {
      $('.res-group').remove();
      footerResize();
      addNotice(201);
      return -2;
    }

    var typeTmp = typeOptions.attr('type');
    if (typeTmp === '') {
      $('.res-group').remove();
      footerResize();
      addNotice(101);
      return -3;
    }

    isLoading = true;

    // add loading icon
    searchLoadingIcon.classList.remove('hide');
    // remove the history query notice
    removeNotice();
    // remove the history query log
    $('.res-group').remove();
    footerResize();
    var url = 'https://api.douban.com/v2/' + typeTmp + '/search',
        data = {
          q: searchInput.val()
        };
        
    $.ajax({
      url: url,
      data: data,
      type: 'GET',
      dataType: 'jsonp',
      success: function(resultJSON) {
        isLoading = false;
        // query success
        searchLoadingIcon.classList.add('hide');
        if (resultJSON.count === 0) {
          // no data find
          addNotice(202);
          return -1;
        }
        // 3 cases: book, music, movie
        switch(typeTmp) {
          case 'book':
            resultJSON.books.forEach(function(item) {
              var authorTmp = item.author;
              if (item.translator) {
                if (item.translator.length !== 0) {
                  // exist translator
                  authorTmp += ' / ';
                  authorTmp += item.translator.join(' ');
                }
              }
              if (item.publisher) {
                // exist publisher
                authorTmp += ' / ';
                authorTmp += item.publisher;
              }
              if (item.pubdate) {
                // exist pubdate
                authorTmp += ' / ';
                authorTmp += item.pubdate.replace(/^([0-9]{4}).*/,"$1");
              }
              addItem(typeTmp, item.title, item.id, item.rating.average, item.rating.numRaters + '&nbsp;评价',
               authorTmp, (item.summary === '')?'暂无介绍':item.summary, item.images.small, item.title);
            });
            break;
          case 'music':
            resultJSON.musics.forEach(function(item) {
              var authorTmp = '',
                  summaryTmp = '暂无介绍';
              if (item.author) {
                if (item.author.length !== 0) {
                  // exist translator
                  var authorTmpArr = new Array();
                  item.author.forEach(function(authorItem) {
                    authorTmpArr.push(authorItem.name);
                  });
                  authorTmp += authorTmpArr.join(' ');
                }
              }
              if (item.publisher) {
                // exist publisher
                authorTmp += ' / ';
                authorTmp += item.publisher;
              }
              if (item.attrs.pubdate) {
                // exist pubdate
                authorTmp += ' / ';
                authorTmp += item.attrs.pubdate[0].replace(/^([0-9]{4}).*/,"$1");
              }
              addItem(typeTmp, item.title, item.id, item.rating.average, item.rating.numRaters + '&nbsp;评价',
               authorTmp, summaryTmp, item.image, item.alt_title);
            });
            break;
          case 'movie':
            resultJSON.subjects.forEach(function(item) {
              var introTmp = new Array();
              var summaryTmp = '暂无介绍';
              if (item.original_title) {
                introTmp.push("原名: " + item.original_title);
              }
              if (item.casts) {
                var castsTmp = new Array();
                item.casts.forEach(function(castItem) {
                  castsTmp.push(castItem.name);
                });
                introTmp.push(castsTmp.join(' / '));
              }
              if (item.directors) {
                introTmp.push(item.directors[0].name);
              }
              if (item.year) {
                // exist pubdate
                introTmp.push(item.year);
              }
              addItem(typeTmp, item.title, item.id, item.rating.average, item.collect_count + '&nbsp;点击',
               introTmp.join(' / '), summaryTmp, item.images.small, item.title);
            });
            break;
        }
        footerResize();
      },
      error: function() {
        isLoading = false;
        searchLoadingIcon.classList.add('hide');
      }
    });
  }

  function addNotice(errCode) {
    var noticeTmp = document.getElementById('notice-' + errCode);
    if (!noticeTmp) {
      // unknown error code
      noticeTmp = document.getElementById('notice-999');
    }
    noticeTmp.classList.remove('hide');
  }

  function removeNotice() {
    $('.search-notice').addClass('hide');
  }

  function addItem(type, name, id, score, comment, author, summary, smallImg, smallImgAlt) {
    var typeStore = {
      book: 'fa-book',
      movie: 'fa-file-movie-o',
      music: 'fa-music'
    };

    if (!typeStore[type]) return -1;

    var resGroup = $('<div></div>'),
        resLeft = $('<div></div>'),
        resRight = $('<div></div>'),
        resCb = $('<div></div>');

    resGroup.attr('class', 'res-group');
    resLeft.attr('class', 'res-left');
    resRight.attr('class', 'res-right');
    resCb.attr('class', 'cb');

    resGroup.append(resLeft, resRight, resCb);

    // resLeft
    var resName = $('<p></p>'),
        faType = $('<i></i>'),
        workName = $('<a></a>');

    resName.attr('class', 'res-name');
    faType.attr({
      class: 'fa ' + typeStore[type],
      'work-type': type
    });
    workName.attr({
      href: './' + type + '.html#' + id,
      target: '_blank',
      workid: id,
      worktype: type
    });
    workName.html(name);

    resName.append(faType, '&nbsp;', workName);

    var resInfo = $('<p></p>'),
        starGroup = $('<span></span>'),
        resComment = $('<span></span>'),
        resAuthor = $('<span></span>');

    resInfo.attr('class', 'res-info');
    starGroup.attr('class', 'star-group');
    resComment.attr('class', 'res-comment');
    resAuthor.attr('class', 'res-author');

    var score2star = parseInt(score);
    for (var i = 0; i <= 4; i++) {
      // mark star to show the score
      var tmp = $('<i></i>');
      if (score2star >= 1.5) tmp.attr('class', 'fa fa-star');
      else if (score2star >= 0.5) tmp.attr('class', 'fa fa-star-half-o');
      else tmp.attr('class', 'fa fa-star-o');
      starGroup.append(tmp);
      score2star -=2;
    }
    resComment.html(comment);
    resAuthor.html(author);

    resInfo.append(starGroup, resComment, resAuthor);

    var resIntro = $('<p></p>');
    resIntro.attr('class', 'res-intro');
    resIntro.html(summary);

    resLeft.append(resName, resInfo, resIntro);

    // resRight
    var resImg = $('<a></a>'),
        smallImgDOM = new Image();
    resImg.attr({
      href: './' + type + '.html#' + id,
      target: '_blank',
      workid: id,
      worktype: type
    });
    smallImgDOM.src = smallImg;
    smallImgDOM.setAttribute('alt', smallImgAlt);

    resImg.append(smallImgDOM);
    resRight.append(resImg);

    searchRes.append(resGroup);
  }

  function footerResize() {
    if ($('body').height() < $(window).height()) {
      $('.footer').css('margin-top', $(window).height()-$('body').height());
    }
    else {
      if (parseInt($('.footer').css('margin-top')) < ($('body').height() - $(window).height())) $('.footer').css('margin-top', 0);
      else $('.footer').css('margin-top', parseInt($('.footer').css('margin-top') - ($('body').height() - $(window).height())));
    }
  }
})()