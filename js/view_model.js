define(['ko', 'gmaps'], function(ko, gmaps) {
  return new (function() {
    var self = this;

    self.museums = ko.observableArray([]);
    self.matchedMuseums = ko.observableArray([]);

    this.filterMuseums = ko.observable("").extend({
      rateLimit: {
        timeout: 1000,
        method: "notifyWhenChangesStop"
      }
    });

    this.filterMuseums.subscribe(function(value) {
      if (value) {
        var re = new RegExp(value, 'i');
        self.matchedMuseums.removeAll();
        for (var i = 0; i < self.museums().length; i++) {
          if (self.museums()[i].title.match(re)) {
            self.matchedMuseums.push(self.museums()[i]);
          }
        }
      } else {
        // just add them all for now
        self.matchedMuseums.removeAll();
        for (var j = 0; j < self.museums().length; j++) {
          self.matchedMuseums.push(self.museums()[j]);
        }
      }
    });

    // this is LatLng of the map center
    self.mapCenter = ko.whatever;

    this.viewMuseum = function(museum) {
      console.log("You clicked " + museum.title);
      if (museum.marker) {
        museum.marker.setAnimation(gmaps.Animation.BOUNCE);
        museum.marker.getMap().panTo(museum.marker.getPosition());
      }
    };
  });
});
