define(['ko', 'gmaps', 'wiki_image', 'street_image', 'foursquare_image', 'silly_pattern'], function(ko, gmaps, wikiImage, streetImage, fourSquareImage, silly) {
  return silly('list-view', function() {
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

    this.active = null;

    this.viewMuseum = function(museum) {
      if (self.active) {
        // deactivate
        self.active.marker.setAnimation(null);
      }

      console.log("You clicked " + museum.title);
      if (museum.marker) {
        console.log(museum.marker.getPosition());
        museum.marker.setAnimation(gmaps.Animation.BOUNCE);

        var markerLoc = museum.marker.getPosition();
        museum.marker.getMap().panTo(markerLoc);

        wikiImage.title(museum.title);
        streetImage.location({lat: markerLoc.lat(), lng: markerLoc.lng()});
        fourSquareImage.location(markerLoc.lat(), markerLoc.lng());
      }

      self.active = museum;
    };
  });
});
