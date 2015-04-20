define(['gmaps', 'list_vm', 'config', 'map_item', 'third_party_api'], function(gmaps, listViewModel, config, MapItem, api) {
  // main map object
  var map = new gmaps.Map(document.getElementById('map-canvas'), {
    center: config.defaults.center,
    zoom: config.defaults.zoom,
    disableDefaultUI: true
  });

  function changeLocation(lat, lng, radius) {
    if (!radius) {
      radius = '1500';
    }

    var location = {lat: lat, lng: lng};
    map.setCenter(location);

    var request = {
      location: location,
      radius: radius,
      types: ['museum']
    };

    api.gmapPlaces(location, radius, ['museum'], map).done(function(foundPlaces) {
      listViewModel.museums.removeAll();

      for (var i = 0; i < foundPlaces.length; i++) {
        var place = foundPlaces[i];
        var m = (function () {
          var item = new MapItem(map, place,
                                 function() {
                                   listViewModel.setHovered(item);
                                 },
                                 function() {
                                   listViewModel.viewMuseum(item);
                                 });
          return item;
        })();

        listViewModel.museums.push(m);
      }
    }).fail(function(errorMsg) {
      // TODO: show error message
      console.log("Places API Error: " + errorMsg);
    });
  }

  return {
    changeLocation: changeLocation
  };
});
