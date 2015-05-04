define(['jquery', 'ko', 'map', 'silly_pattern', 'config', 'third_party_api', 'growl', 'map_item', 'images_vm'], function($, ko, map, silly, config, api, growl, MapItem, imagesVM) {
  return silly('list-view', function() {
    var self = this;

    // controls if list view is hidden/visible
    this.hidden = ko.observable(false);

    // all the map items for the current location
    this.items = ko.observableArray([]).extend({ notify: 'always' });

    // this is the list of items that match filter string
    this.matchedItems = ko.observableArray([]);

    // a filter used to calculate matchedItems subset of all items
    this.filter = ko.observable("").extend({
      rateLimit: {
        timeout: 250,
        method: "notifyWhenChangesStop"
      },
      notify: 'always'
    });

    // a text for "arrow" control - indicating where the list view would move (hide/unhide)
    this.arrowText = ko.computed(function() {
      if (self.hidden()) {
        return "<";
      } else {
        return ">";
      }
    });

    // hide/unhide list view based on its current visibility
    this.toggleVisibility = function() {
      if (this.hidden()) {
        this.unhide();
      } else {
        this.hide();
      }
    };

    // hide the list view
    this.hide = function() {
      if (!this.hidden()) {
        this.hidden(true);
        $('#list-view').animate({right: "-25ex"});
      }
    };

    // unhide the list view
    this.unhide = function() {
      if (this.hidden()) {
        this.hidden(false);
        $('#list-view').animate({right: "0"});
      }
    };

    // "search" functionality - treat filter as a regexp
    // any matching items are propogated to matchedItems
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
        // in case there's no filter - all items are matched
        self.matchedItems.removeAll();
        for (i = 0, l = self.items().length; i < l; i++) {
          item = self.items()[i];
          self.matchedItems.push(item);
          item.show();
        }
      }

      self.clearActive();
    });

    // active item (if any)
    this.active_ = null;

    // hovered item (if any)
    this.hovered_ = null;

    // set an item as "hovered" - this is used when marker is hovered
    // in that case we "remember" that item as such and make sure that
    // ko re-renders the view and applies proper css class to hovered item
    this.setHovered = function(m) {
      self.hovered_ = m;
      self.matchedItems.valueHasMutated();
    };

    // produces a css class for an item
    this.hovered = function(index, element) {
      var item = self.matchedItems()[index()];
      if (self.hovered_ === item) {
        element.scrollIntoView();
        return 'active';
      }
      return '';
    };

    // clears "active" item
    // - item's deactivate will take care of all its things like stopping animation, etc
    // - we also notify Images ViewModel to clear current images
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

    // an item is chosen either by marker clicking or via list view
    // in both cases we remember it as "active"
    // and initiate all the external API work:
    // - grabbing images
    // - grabbing wikipedia extract for infowindow
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

    // "main entry point"
    // - set map's center to location
    // - obtain a list of items for that location
    // - cleanup existing list
    // - populate it with new items
    this.changeLocation = function(lat, lng, radius) {
      if (!radius) {
        radius = config.defaults.radius;
      }

      var location = {lat: lat, lng: lng};
      map.setCenter(location);

      var removed = self.items.removeAll();
      var i = 0;
      // cleanup map items (by removing markers from the map)
      for (; i < removed.length; i++) {
        removed[i].remove();
      }
      self.matchedItems.removeAll();
      self.clearActive();
      self.unhide();

      api.gmapPlaces(location, radius, ['museum']).fail(function(errorMsg) {
        growl.error({title: "Places API Error", message: errorMsg});
      }).done(function(foundPlaces) {
        for (i = 0; i < foundPlaces.length; i++) {
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
