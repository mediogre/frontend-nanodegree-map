define(['gmaps', 'view_model'], function(gmaps, viewModel) {
  var moscow = {lat: 55.752532, lng: 37.622828};

  var map = new gmaps.Map(document.getElementById('map-canvas'), {
    center: moscow,
    zoom: 15,
    disableDefaultUI: true
  });

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
        viewModel.museums.removeAll();

        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          var marker = createMarker(results[i]);

          viewModel.museums.push({title: place.name, marker: marker});
        }
      }

      // TODO: error handling
    });
  }

  changeLocation(moscow.lat, moscow.lng);

  return {
    changeLocation: changeLocation
  };
});
