define(['ko', 'gmaps', 'wiki_image', 'street_image', 'foursquare_image', 'silly_pattern', 'config'], function(ko, gmaps, wikiImage, streetImage, fourSquareImage, silly, config) {
  return silly('list-view', function() {
    var self = this;

    self.museums = ko.observableArray([]).extend({ notify: 'always' });
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

    this.active_ = null;
    this.hovered_ = null;

    this.setHovered = function(m) {
      console.log("Setting hovered: ", m);
      self.hovered_ = m;
      self.museums.valueHasMutated();
    };

    this.hovered = function(index, element) {
      var museum = self.museums()[index()];
      console.log("Hovered computed called:", museum);
      if (self.hovered_ === museum) {
        element.scrollIntoView();
        return 'active';
      }
      return '';
    };

    this.viewMuseum = function(museum) {
      if (self.active_) {
        // deactivate
        self.active_.marker.setAnimation(null);
      }

      console.log("You clicked " + museum.title);
      if (museum.marker) {
        console.log(museum.marker.getPosition());
        museum.marker.setAnimation(gmaps.Animation.BOUNCE);
        setTimeout(function() {
          museum.hideMarker();
        }, config.bounceTime);

        var markerLoc = museum.marker.getPosition();
        museum.marker.getMap().panTo(markerLoc);

        wikiImage.title(museum.title);
        streetImage.location({lat: markerLoc.lat(), lng: markerLoc.lng()});
        fourSquareImage.location(markerLoc.lat(), markerLoc.lng());
      }

      self.active_ = museum;
    };
  });
});
