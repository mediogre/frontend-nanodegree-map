define(['gmaps', 'list_vm', 'config'], function(gmaps, listViewModel, config) {
  // main map object
  var map = new gmaps.Map(document.getElementById('map-canvas'), {
    center: config.defaults.center,
    zoom: config.defaults.zoom,
    disableDefaultUI: true
  });

  // places service object
  var places = new gmaps.places.PlacesService(map);

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new gmaps.Marker({
      map: map,
      position: place.geometry.location
    });

    // gmaps.event.addListener(marker, 'click', function() {
    //   infowindow.setContent(place.name);
    //   infowindow.open(map, this);
    // });

    return marker;
  }

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
          var marker = createMarker(results[i]);

          listViewModel.museums.push({title: place.name, marker: marker});
        }
      }

      // TODO: error handling
    });
  }

  return {
    changeLocation: changeLocation
  };
});
