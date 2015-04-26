define(['jquery'], function($) {
  // get an extract of max numChars from wikipedia
  // based on location.
  // We first try to use GeoData extension to find the pageid by location,
  // then we actually try to get the extract of the first page
  // a promise is returned which if successul would return
  // an object with title and extract
  // otherwise an error message will be conveyed via reject
  return function(location, numChars) {
    if (!numChars) {
      numChars = 150;
    }
    var d = $.Deferred();
    $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      type: 'GET',
      dataType: 'jsonp',
      data: {
        action: 'query',
        list: 'geosearch',
        gsradius: 100,
        format: 'json',
        gscoord: location.lat + '|'+ location.lng
      },
      headers: {
        'Api-User-Agent': 'UdacityMapper/1.0'
      }
    }).done(function(json) {
      if (!json.query || !json.query.geosearch || !Array.isArray(json.query.geosearch) || json.query.geosearch.length < 1) {
        d.reject("No results from Wikipedia GeoData");
        return;
      }

      // results are returned sorted by closest to given gscoord
      // so we just take the first result
      var pageid = json.query.geosearch[0].pageid;

      $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        type: 'GET',
        dataType: 'jsonp',
        data: {
          action: 'query',
          pageids: pageid,
          prop: 'extracts',
          format: 'json',
          exchars: numChars
        },
        headers: {
          'Apin-User-Agent': 'UdacityMapper/1.0'
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
          d.reject("Could not find Wikipedia page");
          return;
      }

        if (!page.extract) {
          d.reject("Could not find Wikipedia extract");
          return;
      }

        d.resolve({title: page.title, extract: page.extract});
      }).fail(function(err) {
        d.reject("Wikipedia Extract Request Error");
      });
    }).fail(function(err) {
        d.reject("Wikipedia Extract Request Error");
    });
    return d.promise();
  };
});


