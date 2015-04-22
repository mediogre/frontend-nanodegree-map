define(['jquery', 'gmaps', 'map'], function($, gmaps, map) {
  // private data of gmapPlaces - a PlacesService instance
  var placesService = new gmaps.places.PlacesService(map);;

  // private data of error reporting code for PlacesService
  var placesErrorCodes = {};
  placesErrorCodes[gmaps.places.PlacesServiceStatus.INVALID_REQUEST] = 'This request was invalid.';
  placesErrorCodes[gmaps.places.PlacesServiceStatus.OVER_QUERY_LIMIT] = 'The application has gone over its request quota.';
  placesErrorCodes[gmaps.places.PlacesServiceStatus.REQUEST_DENIED] = 'The application is not allowed to use the PlacesService.';
  placesErrorCodes[gmaps.places.PlacesServiceStatus.UNKNOWN_ERROR] = 'The PlacesService request could not be processed due to a server error. The request may succeed if you try again.';
  placesErrorCodes[gmaps.places.PlacesServiceStatus.ZERO_RESULTS] = 'No result was found for this request.';

  // Google Map Places API
  return function(location, radius, types) {
    var request = {
      location: location,
      radius: radius,
      types: types
    };

    var d = $.Deferred();
    placesService.nearbySearch(request, function(results, status) {
      if (status === gmaps.places.PlacesServiceStatus.OK) {
        // parse and resolve
        d.resolve(results);
      } else {
        // reject with error message/status
        var errorMessage = placesErrorCodes[status];
        if (! errorMessage) {
          errorMessage = 'Unknown PlacesService error';
        }
        d.reject(errorMessage);
      }
    });
    return d.promise();
  };
});
