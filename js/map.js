define(['gmaps', 'jquery', 'config'], function(gmaps, $, config) {
  // main map object
  var map = new gmaps.Map($('#map-canvas')[0], {
    center: config.defaults.center,
    zoom: config.defaults.zoom,
    disableDefaultUI: true
  });

  return map;
});
