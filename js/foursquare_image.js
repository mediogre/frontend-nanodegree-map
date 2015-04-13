define(['ko', 'silly_pattern', 'third_party_api'], function(ko, silly, api) {
  return silly('foursquare-image', function() {
    var self = this;
    
    this.url = ko.observable();

    this.location = function(lat, lng) {
      api.fourSquare(lat, lng).
        done(function(obj) {
          self.url(obj.url);
        }).
        fail(function(err) {console.log("FourSquare failed with " + err);});
    };
  });
});
