define(['silly_pattern', 'ko', 'third_party_api'], function(silly, ko, api) {
  return silly('street-image', function() {
    var self = this;

    this.location = ko.observable();
    this.url = ko.observable();

    this.location.subscribe(function(v) {
      self.url(api.streetImageURL(v.lat, v.lng));
    });
  });
});
