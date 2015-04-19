define(['gmaps', 'list_vm', 'config', 'map_item'], function(gmaps, listViewModel, config, MapItem) {
  // main map object
  var map = new gmaps.Map(document.getElementById('map-canvas'), {
    center: config.defaults.center,
    zoom: config.defaults.zoom,
    disableDefaultUI: true
  });

  // places service object
  var places = new gmaps.places.PlacesService(map);

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

    places.nearbySearch(request, function(results, status) {
      if (status === gmaps.places.PlacesServiceStatus.OK) {
        listViewModel.museums.removeAll();

        for (var i = 0; i < results.length; i++) {
          var place = results[i];
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
      }

      // TODO: error handling
    });
  }

  return {
    changeLocation: changeLocation
  };
});
