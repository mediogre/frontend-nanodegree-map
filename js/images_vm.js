define(['silly_pattern', 'third_party_api', 'growl'], function(silly, api, growl) {
  return silly('images', function() {
    var self = this;

    this.location = ko.observable();
    this.streetUrl = ko.observable();
    this.foursquareUrl = ko.observable();

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

    this.clear = function() {
      this.streetUrl(null);
      this.foursquareUrl(null);
    };
  });
});
