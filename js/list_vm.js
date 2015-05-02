define(['jquery', 'ko', 'map', 'silly_pattern', 'config', 'third_party_api', 'growl', 'map_item', 'images_vm'], function($, ko, map, silly, config, api, growl, MapItem, imagesVM) {
  return silly('list-view', function() {
    var self = this;

    this.hidden = ko.observable(false);
    this.items = ko.observableArray([]).extend({ notify: 'always' });
    this.matchedItems = ko.observableArray([]);

    this.filter = ko.observable("").extend({
      rateLimit: {
        timeout: 250,
        method: "notifyWhenChangesStop"
      },
      notify: 'always'
    });

    this.arrowText = ko.computed(function() {
      if (self.hidden()) {
        return "<";
      } else {
        return ">";
      }
    });

    this.toggleVisibility = function() {
      if (this.hidden()) {
        this.unhide();
      } else {
        this.hide();
      }
    };

    this.hide = function() {
      if (!this.hidden()) {
        this.hidden(true);
        $('#list-view').animate({right: "-25ex"});
      }
    };

    this.unhide = function() {
      if (this.hidden()) {
        this.hidden(false);
        $('#list-view').animate({right: "0"});
      }
    };

    this.filter.subscribe(function(value) {
      var i, l, item;
      if (value) {
        var re = new RegExp(value, 'i');
        self.matchedItems.removeAll();
        for (i = 0, l = self.items().length; i < l; i++) {
          item = self.items()[i];
          if (item.title.match(re)) {
            self.matchedItems.push(item);
            item.show();
          } else {
            item.hide();
          }
        }
      } else {
        // just add them all for now
        self.matchedItems.removeAll();
        for (i = 0, l = self.items().length; i < l; i++) {
          item = self.items()[i];
          self.matchedItems.push(item);
          item.show();
        }
      }

      self.clearActive();
    });

    this.active_ = null;
    this.hovered_ = null;

    this.setHovered = function(m) {
      self.hovered_ = m;
      self.matchedItems.valueHasMutated();
    };

    this.hovered = function(index, element) {
      var item = self.matchedItems()[index()];
      if (self.hovered_ === item) {
        element.scrollIntoView();
        return 'active';
      }
      return '';
    };

    this.clearActive = function() {
      if (self.active_) {
        self.active_.deactivate();
        self.active_ = null;

        imagesVM.clear();
      }
    };

    // determine if list view is too big for current viewport
    // that is it takes close to half of the screen or more
    this.tooBig = function() {
      return !window.matchMedia("(min-width: 70ex").matches;
    };

    this.chooseItem = function(item) {
      if (self.tooBig()) {
        self.hide();
      }
      self.clearActive();

      if (item.marker) {
        item.activate();

        imagesVM.location(item.location);

        self.active_ = item;
        api.wikipediaExtract(item.location, 500).done(function(extract) {
          if (self.active_ === item) {
            // make sure that user has not chosen another item
            // while extract arrived
            item.infoWindow(extract.extract);
          }
        }).fail(function(errMsg) {
          growl.error({title: 'Wikipedia Extract', message: errMsg});
        });
      }
    };

    this.changeLocation = function(lat, lng, radius) {
      if (!radius) {
        radius = config.defaults.radius;
      }

      var location = {lat: lat, lng: lng};
      map.setCenter(location);

      self.items.removeAll();
      self.matchedItems.removeAll();
      self.clearActive();

      api.gmapPlaces(location, radius, ['museum']).fail(function(errorMsg) {
        growl.error({title: "Places API Error", message: errorMsg});
      }).done(function(foundPlaces) {
        for (var i = 0; i < foundPlaces.length; i++) {
          var place = foundPlaces[i];
          var m = (function () {
            var item = new MapItem(map, place,
                                   function() {
                                     if (!self.hidden()) {
                                       self.setHovered(item);
                                     }
                                   },
                                   function() {
                                     self.chooseItem(item);
                                   });
            return item;
          })();

          self.items.push(m);
          self.filter.valueHasMutated();
        }
      });
    };
  });
});
