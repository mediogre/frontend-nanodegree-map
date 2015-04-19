define(['gmaps'], function(gmaps) {
  var MapItem = function(map, place, mouseOver, mouseClick) {
    this.title = place.name;
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

  MapItem.prototype.hideMarker = function () {
    this.marker.setAnimation(null);
    this.marker.setVisible(false);

    var self = this;
    setTimeout(function() {
      self.marker.setVisible(true);
    }, 1000);
  };

  return MapItem;
});
