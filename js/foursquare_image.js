define(['ko', 'silly_pattern', 'third_party_api', 'growl'], function(ko, silly, api, growl) {
  return silly('foursquare-image', function() {
    var self = this;

    this.url = ko.observable();

    this.location = function(lat, lng) {
      api.fourSquare(lat, lng).
        done(function(obj) {
          self.url(obj.url);
        }).
        fail(function(err) {
          self.url(null);
          growl.error({title: "FourSquare Image", message: err});
        });
    };
  });
});
