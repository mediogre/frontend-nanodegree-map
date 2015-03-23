define(['jquery', 'ko'], function ($, ko) {
  var moscow = new google.maps.LatLng(55.752532, 37.622828);

  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: moscow,
    zoom: 15
  });

  var request = {
    location: moscow,
    radius: '1500',
    types: ['museum']
  };

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }
});
