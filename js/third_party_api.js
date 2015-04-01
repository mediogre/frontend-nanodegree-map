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

  // wikipedia

  // g+

  // foursquare

  // meetup

  // flickr?

  // yelp?

  // export our third-party API low-level routines
  return {
    googleGeocoding: geocode
  };
});
