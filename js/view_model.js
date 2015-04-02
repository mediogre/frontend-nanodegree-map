define(['ko', 'gmaps'], function(ko, gmaps) {
  return new (function() {
    var self = this;

    self.museums = ko.observableArray();

    // this is LatLng of the map center
    self.mapCenter = ko.whatever;

    this.viewMuseum = function(museum) {
      console.log("You clicked " + museum.title);
      if (museum.marker) {
        museum.marker.setAnimation(gmaps.Animation.BOUNCE);
      }
    };
  });
});
