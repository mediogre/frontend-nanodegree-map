define(['gmaps', 'config'], function(gmaps, config) {
  // shared info window
  var infoWindow = new gmaps.InfoWindow();

  // a MapItem basically encapsulates a marker for a place
  // and handles UI events related to the marker:
  // - clicking, hovering, animating, etc
  //
  // mouseOver and mouseClick are callbacks to be called for the corresponding marker events
  var MapItem = function(map, place, mouseOver, mouseClick) {
    // place title
    this.title = place.name;

    // place location
    this.location = {lat: place.geometry.location.lat(),
                     lng: place.geometry.location.lng()};

    // gmaps marker for the place
    this.marker = new gmaps.Marker({
      map: map,
      position: place.geometry.location
    });

    if (mouseOver) {
      this.mouseOver = gmaps.event.addListener(this.marker, 'mouseover', mouseOver);
    }

    if (mouseClick) {
      this.mouseClick = gmaps.event.addListener(this.marker, 'click', mouseClick);
    }
  };

  // remove the place from the map, stop animation if any
  // used when we change locations and don't need old items/markers any longer
  MapItem.prototype.remove = function() {
    this.deactivate();
    this.marker.setMap(null);
  };

  // stop the animation and close info window
  MapItem.prototype.deactivate = function() {
    this.marker.setAnimation(null);
    infoWindow.close();
  };

  // bounce for a while to indicate activation
  // and center the map to itself
  MapItem.prototype.activate = function() {
    var self = this;
    this.marker.setAnimation(gmaps.Animation.BOUNCE);

    setTimeout(function() {
      self.marker.setAnimation(null);
    }, config.bounceTime);

    var markerLoc = this.marker.getPosition();
    this.marker.getMap().panTo(markerLoc);
  };

  // make sure that item is visible (used when filtering)
  MapItem.prototype.show = function() {
    this.marker.setVisible(true);
  };

  // make sure that item is invisible (used when filtering)
  MapItem.prototype.hide = function() {
    this.marker.setAnimation(null);
    this.marker.setVisible(false);
  };

  // open info window with provided text
  MapItem.prototype.infoWindow = function(text) {
    infoWindow.close();
    infoWindow.setOptions({maxWidth: 200});
    infoWindow.setContent(text);
    infoWindow.open(this.marker.getMap(), this.marker);
  };

  return MapItem;
});
