define(['silly_pattern', 'third_party_api', 'growl', 'ko'], function(silly, api, growl, ko) {
  // Images ViewModel
  return silly('images', function() {
    var self = this;

    // current location
    this.location = ko.observable();

    // url for the location coming from StreetView API
    this.streetUrl = ko.observable();

    // url for the location coming from FourSquare API
    this.foursquareUrl = ko.observable();

    // when location changes we must update images accordingly
    this.location.subscribe(function(v) {
      // update street image 
      self.streetUrl(api.streetImageURL(v.lat, v.lng));

      // try to update foursquare image
      api.fourSquare(v.lat, v.lng).
        done(function(obj) {
          self.foursquareUrl(obj.url);
        }).
        fail(function(err) {
          self.foursquareUrl(null);
          growl.error({title: "FourSquare Image", message: err});
        });
    });

    // clear current images (if any)
    this.clear = function() {
      this.streetUrl(null);
      this.foursquareUrl(null);
    };
  });
});
