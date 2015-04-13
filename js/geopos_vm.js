define(['ko', 'jquery', 'third_party_api', 'map'], function(ko, $, api, map) {
  var GeoVM = function() {
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
      map.changeLocation(geoLocation.location.lat, geoLocation.location.lng);
    };
  };

  var vm = new GeoVM();
  ko.applyBindings(vm, $('#geo-view')[0]);

  return vm;
});
