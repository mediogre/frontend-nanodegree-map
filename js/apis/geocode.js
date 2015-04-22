define(['jquery'], function($) {
  // Google geocoding API
  return function(searchStr) {
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
  };
});
