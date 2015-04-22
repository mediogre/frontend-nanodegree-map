define(['ko', 'map', 'wiki_image', 'street_image', 'foursquare_image', 'silly_pattern', 'config', 'third_party_api', 'growl', 'map_item'], function(ko, map, wikiImage, streetImage, fourSquareImage, silly, config, api, growl, MapItem) {
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
        self.active_.deactivate();
      }

      console.log("You clicked " + museum.title);
      if (museum.marker) {
        console.log(museum.marker.getPosition());
        museum.activate();

        wikiImage.title(museum.title);
        streetImage.location({lat: museum.lat, lng: museum.lng});
        fourSquareImage.location(museum.lat, museum.lng);
      }

      self.active_ = museum;
    };

    this.changeLocation = function(lat, lng, radius) {
      if (!radius) {
        radius = config.defaults.radius;
      }

      var location = {lat: lat, lng: lng};
      map.setCenter(location);

      api.gmapPlaces(location, radius, ['museum']).fail(function(errorMsg) {
        growl.error({title: "Places API Error", message: errorMsg});
      }).done(function(foundPlaces) {
        self.museums.removeAll();

        for (var i = 0; i < foundPlaces.length; i++) {
          var place = foundPlaces[i];
          var m = (function () {
            var item = new MapItem(map, place,
                                   function() {
                                     self.setHovered(item);
                                   },
                                   function() {
                                     self.viewMuseum(item);
                                   });
            return item;
          })();

          self.museums.push(m);
        }
      });
    };
  });
});
