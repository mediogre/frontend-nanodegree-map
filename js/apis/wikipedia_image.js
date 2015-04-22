define(['jquery'], function($) {
  // get an image from wikipedia based on searchStr
  // a promise is returned which if successul would return
  // an object with title and url of the image
  // otherwise an error message will be conveyed via reject
  return function(searchStr) {
    var d = $.Deferred();

    $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      type: 'GET',
      dataType: 'jsonp',
      data: {
        action: 'query',
        titles: searchStr,
        prop: 'images',
        format: 'json',
        'imlimit': 2
      },
      headers: {
        'Api-User-Agent': 'UdacityMapper/1.0'
      }
    }).done(function(json) {
      var page;
      for (var k in json.query.pages) {
        if (json.query.pages.hasOwnProperty(k)) {
          page = json.query.pages[k];
          break;
        }
      }

      if (! page) {
        d.reject("Could not find any wikipedia page");
        return;
      }

      if (!page.images || page.images.length < 1) {
        d.reject("No images found");
        return;
      }

      var image = page.images[0];
      var title = image.title;

      $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        type: 'GET',
        dataType: 'jsonp',
        data: {
          action: 'query',
          titles: title,
          prop: 'imageinfo',
          format: 'json',
          iiprop: 'url'
        },
        headers: {
          'Api-User-Agent': 'UdacityMapper/1.0'
        }
      }).done(function(json) {
        var page;
        for (var k in json.query.pages) {
          if (json.query.pages.hasOwnProperty(k)) {
            page = json.query.pages[k];
            break;
          }
        }

        if (! page) {
          d.reject("Could not get image URL");
          return;
        }

        d.resolve({title: page.title,
                   url: page.imageinfo[0].url
                  });
      }).fail(function() {
        d.reject("Could not get image URL");
      });
    }).fail(function() {
      d.reject("Could not get Wikipedia JSON");
    });

    return d.promise();
  };
});
