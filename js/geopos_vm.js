define(['ko', 'third_party_api', 'list_vm', 'silly_pattern', 'config'], function(ko, api, lvm, silly, config) {
  // A ViewModel responsible for searching geolocation,
  // showing found candidates,
  // and jumping to one of them
  return silly('geo-view', function() {
    var self = this;

    // search string for choosing geo location
    this.searchCenter = ko.observable(config.defaults.centerLocation).extend({
      rateLimit: {
        timeout: 1000,
        method: "notifyWhenChangesStop"
      }
    });

    // the observable array of locations - will be filled by results from Geocoding API
    this.listOfLocations = ko.observableArray([]);

    // search for locations using Geocoding API
    // and regenerate a list of locations based on that
    this.searchCenter.subscribe(function(value) {
      api.googleGeocoding(value).done(function(x) {
        self.listOfLocations.removeAll();

        for (var i = 0; i < x.length; i++) {
          self.listOfLocations.push(x[i]);
        }
      });
    });

    // clicking on location will update the list view (and let it handle the rest)
    this.goToLocation = function(geoLocation) {
      lvm.changeLocation(geoLocation.location.lat, geoLocation.location.lng);
    };
  });
});
