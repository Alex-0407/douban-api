(function() {
  var searchInput = $("#search-input"),
      searchTrigger = $("#searchTrigger"),
      searchRes = $(".search-res");

  var isLoading = false;

  searchTrigger.click(function() {
    search(searchInput.val());
  });

  document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e && e.keyCode==13){
      // press key 'enter'
      if (document.activeElement.id !== "search-input") {
        // not focus on the search-input
        return -1;
      }
      search(searchInput.val());
    }
  };

  function search(str) {
    if (isLoading) return -1;
    if (searchInput.val() == "") return -2;
    var url = './api/search.php',
        data = {
          search: searchInput.val(),
          type: 'book'
        };
    isLoading = true;
    $.ajax({
      url: url,
      data: data,
      type: "POST",
      success: function(result) {
        isLoading = false;
        var resultJSON = JSON.parse(result);
        if (resultJSON.status) {
          // query success
          // remove the history query log
          $(".res-group").remove();
          resultJSON.data.forEach(function(item) {
            var authorTmp = item.author;
            if (item.translator.length != 0) {
              // exist translator
              authorTmp += ' / ';
              authorTmp += item.translator.join(' ');
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
            addItem(resultJSON.type, item.title, item.id, item.rating.average, item.rating.numRaters,
             authorTmp, item.summary, JSON.stringify(item.images.small), item.title);
          });
        }
        else {
          // query error

        }
      },
      error: function() {
        isLoading = false;
      }
    });
  }

  function addItem(type, name, id, score, comment, author, summary, smallImg, smallImgAlt) {
    console.log(typeof (smallImg));
    var typeStore = {
      book: 'fa-book',
      movie: 'fa-file-movie-o',
      music: 'fa-music'
    };

    if (!typeStore[type]) return -1;

    var resGroup = $("<div></div>"),
        resLeft = $("<div></div>"),
        resRight = $("<div></div>"),
        resCb = $("<div></div>");

    resGroup.attr("class", "res-group");
    resLeft.attr("class", "res-left");
    resRight.attr("class", "res-right");
    resCb.attr("class", "cb");

    resGroup.append(resLeft, resRight, resCb);

    // resLeft
    var resName = $("<p></p>"),
        faType = $("<i></i>"),
        workName = $("<a></a>");

    resName.attr("class", "res-name");
    faType.attr({
      class: "fa " + typeStore[type],
      'work-type': type
    });
    workName.attr({
      href: "#",
      workid: id,
      worktype: type
    });
    workName.html(name);

    resName.append(faType, "&nbsp;", workName);

    var resInfo = $("<p></p>"),
        starGroup = $("<span></span>"),
        resComment = $("<span></span>"),
        resAuthor = $("<span></span>");

    resInfo.attr("class", "res-info");
    starGroup.attr("class", "star-group");
    resComment.attr("class", "res-comment");
    resAuthor.attr("class", "res-author");

    var score2star = parseInt(score);
    for (var i = 0; i <= 4; i++) {
      // mark star to show the score
      var tmp = $("<i></i>");
      if (score2star >= 1.5) tmp.attr("class", "fa fa-star");
      else if (score2star >= 0.5) tmp.attr("class", "fa fa-star-half-o");
      else tmp.attr("class", "fa fa-star-o");
      starGroup.append(tmp);
      score2star -=2;
    }
    resComment.html(comment+"&nbsp;评价");
    resAuthor.html(author);

    resInfo.append(starGroup, resComment, resAuthor);

    var resIntro = $("<p></p>");
    resIntro.attr("class", "res-intro");
    resIntro.html(summary);

    resLeft.append(resName, resInfo, resIntro);

    // resRight
    var resImg = $("<a></a>"),
        smallImgDOM = $("<img>");
    resImg.attr({
      href: "#",
      workid: id,
      worktype: type
    });
    smallImgDOM.attr({
      src: smallImg,
      alt: smallImgAlt
    });
    resImg.append(smallImgDOM);
    resRight.append(resImg);

    searchRes.append(resGroup);
  }
})()