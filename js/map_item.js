define(['gmaps', 'config'], function(gmaps, config) {
  var MapItem = function(map, place, mouseOver, mouseClick) {
    this.title = place.name;
    this.lat = place.geometry.location.lat();
    this.lng = place.geometry.location.lng();
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

  MapItem.prototype.hideMarker = function() {
    this.marker.setAnimation(null);
    this.marker.setVisible(false);

    var self = this;
    setTimeout(function() {
      self.marker.setVisible(true);
    }, 1000);
  };

  MapItem.prototype.deactivate = function() {
    this.marker.setAnimation(null);
  };

  MapItem.prototype.activate = function() {
    var self = this;
    this.marker.setAnimation(gmaps.Animation.BOUNCE);

    setTimeout(function() {
      self.hideMarker();
    }, config.bounceTime);

    var markerLoc = this.marker.getPosition();
    this.marker.getMap().panTo(markerLoc);
  };

  return MapItem;
});
