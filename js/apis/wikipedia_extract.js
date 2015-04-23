define(['jquery'], function($) {
  // get an extract of max numChars from wikipedia
  // based on searchStr
  // a promise is returned which if successul would return
  // an object with title and extract
  // otherwise an error message will be conveyed via reject
  return function(searchStr, numChars) {
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
        titles: searchStr,
        prop: 'extracts',
        format: 'json',
        exchars: numChars
      },
      headers: {
        'Api-User-Agent': 'UdacityMapper/1.0'
      }
    }).done(function(json) {
      console.log("WikipediaExtract: ", json);
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

      if (!page.extract) {
        d.reject("Could not find wikipedia extract");
        return;
      }

      d.resolve({title: page.title, extract: page.extract});
    });
    return d.promise();
  };
});
