define(['jquery', 'config'], function($, config) {
  // foursquare
  return function(lat, lng, imageWidth, imageHeight) {
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
  };
});
