// This module is just a plumbing component which
// provides a set of utilities 'talking' to 3rd-parties, like
// wikipedia or google geocoding.
// In a sense this is a simple interface for all those 3rd parties:
// for geocode we want to give a searchString and get a list of locations
// or be notified of the error.
// All the details of underlying API, parsing, etc is this utility function's job
// and we don't want any part of that
define(['jquery', 'gmaps', 'config'], function($, gmaps, config) {
  // private data of gmapPlaces - a PlacesService instance
  var placesService_;

  // private data of error reporting code for PlacesService
  var placesErrorCodes_ = {};
  placesErrorCodes_[gmaps.places.PlacesServiceStatus.INVALID_REQUEST] = 'This request was invalid.';
  placesErrorCodes_[gmaps.places.PlacesServiceStatus.OVER_QUERY_LIMIT] = 'The application has gone over its request quota.';
  placesErrorCodes_[gmaps.places.PlacesServiceStatus.REQUEST_DENIED] = 'The application is not allowed to use the PlacesService.';
  placesErrorCodes_[gmaps.places.PlacesServiceStatus.UNKNOWN_ERROR] = 'The PlacesService request could not be processed due to a server error. The request may succeed if you try again.';
  placesErrorCodes_[gmaps.places.PlacesServiceStatus.ZERO_RESULTS] = 'No result was found for this request.';

  // Google Map Places API
  var gmapPlaces = function(location, radius, types, map) {
    if (!placesService_) {
      placesService_ = new gmaps.places.PlacesService(map);
    }

    var request = {
      location: location,
      radius: radius,
      types: types
    };

    var d = $.Deferred();
    placesService_.nearbySearch(request, function(results, status) {
      if (status === gmaps.places.PlacesServiceStatus.OK) {
        // parse and resolve
        d.resolve(results);
      } else {
        // reject with error message/status
        var errorMessage = placesErrorCodes_[status];
        if (! errorMessage) {
          errorMessage = 'Unknown PlacesService error';
        }
        d.reject(errorMessage);
      }
    });
    return d.promise();
  };

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
  }

  // foursquare
  function fourSquare(lat, lng, imageWidth, imageHeight) {
    if (!imageWidth) {
      imageWidth = 200;
    }

    if (!imageHeight) {
      imageHeight = 200;
    }

    var d = $.Deferred();

    $.getJSON('https://api.foursquare.com/v2/venues/search',
              {ll: lat + ',' + lng,
               oauth_token: config.fourSquareToken,
               v: '20150413',
               limit: 1
              }).done(function(response) {
                console.log(response);
                if ( !(response.meta && response.meta.code === 200)) {
                  d.reject("Foursquare search failed");
                  return;
                }

                if (! (response.response.venues && response.response.venues instanceof Array && response.response.venues.length > 0)) {
                  d.reject("Foursquare search returned no venues");
                  return;
                }

                var venue = response.response.venues[0];

                $.getJSON('https://api.foursquare.com/v2/venues/' + venue.id + '/photos',
                          {oauth_token: config.fourSquareToken,
                           v: '20150413',
                           limit: 1
                          }).done(function(response) {
                            if ( !(response.meta && response.meta.code === 200)) {
                              d.reject("Foursquare Photos search failed");
                              return;
                            }

                            if (response.response.photos.count <= 0) {
                              d.reject("No photos from FourSquare");
                              return;
                            }

                            var image = response.response.photos.items[0];
                            d.resolve({url: image.prefix + imageWidth + 'x' + imageHeight + image.suffix});
                         }).fail(function() {
                           d.reject("Four Square Photos Error");
                         });
    }).fail(function() {
      d.reject("Four Square Error");
    });

    return d.promise();
  }

  // export our third-party API low-level routines
  return {
    googleGeocoding: geocode,
    wikipediaImages: wikipediaImages,
    streetImageURL: streetImageURL,
    fourSquare: fourSquare,
    gmapPlaces: gmapPlaces
  };
});
