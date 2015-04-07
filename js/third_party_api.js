// This module is just a plumbing component which
// provides a set of utilities 'talking' to 3rd-parties, like
// wikipedia or google geocoding.
// In a sense this is a simple interface for all those 3rd parties:
// for geocode we want to give a searchString and get a list of locations
// or be notified of the error.
// All the details of underlying API, parsing, etc is this utility function's job
// and we don't want any part of that
define(['jquery', 'config'], function($, conf) {

  // Google geocoding API
  function geocode(searchStr) {
    var d = $.Deferred();
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json',
              {address: searchStr}
             ).done(function(json) {
               // grab only 5 (or less) first results
               var simplifiedResult = json.results.slice(0, 5).map(function(obj) {
                 return {
                   formatted_address: obj.formatted_address,
                   location: obj.geometry.location,
                   place_id: obj.place_id
                 };
               });
               d.resolve(simplifiedResult);
             }).fail(function() {
               d.reject();
             });
    return d.promise();
  }

  // returns URL to street image using Static Street View API
  function streetImageURL(lat, lng, sizex, sizey) {
    if (!sizex) {
      sizex = 200;
    }
    if (!sizey) {
      sizey = 200;
    }

    return 'https://maps.googleapis.com/maps/api/streetview?size=' + sizex + 'x' + sizey + '&location=' + lat + ',' + lng;
  }

  // get an image from wikipedia based on searchStr
  // a promise is returned which if successul would return
  // an object with title and url of the image
  // otherwise an error message will be conveyed via reject
  function wikipediaImages(searchStr) {
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
      // console.log(json);

      var page;
      for (var k in json.query.pages) {
        if (json.query.pages.hasOwnProperty(k)) {
          page = json.query.pages[k];
          break;
        }
      }

      // console.log(page);
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
        // console.log(json);

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
  }
  // g+

  // foursquare

  // meetup

  // flickr?

  // yelp?

  // export our third-party API low-level routines
  return {
    googleGeocoding: geocode,
    wikipediaImages: wikipediaImages,
    streetImageURL: streetImageURL
  };
});
