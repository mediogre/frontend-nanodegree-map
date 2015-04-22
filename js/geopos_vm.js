define(['ko', 'third_party_api', 'list_vm', 'silly_pattern'], function(ko, api, lvm, silly) {
  return silly('geo-view', function() {
    var self = this;

    this.searchCenter = ko.observable("Moscow").extend({
      rateLimit: {
        timeout: 1000,
        method: "notifyWhenChangesStop"
      }
    });

    this.listOfLocations = ko.observableArray([]);

    this.searchCenter.subscribe(function(value) {
      api.googleGeocoding(value).done(function(x) {
        self.listOfLocations.removeAll();

        for (var i = 0; i < x.length; i++) {
          self.listOfLocations.push(x[i]);
        }
      });
    });

    this.goToLocation = function(geoLocation) {
      lvm.changeLocation(geoLocation.location.lat, geoLocation.location.lng);
    };
  });
});
