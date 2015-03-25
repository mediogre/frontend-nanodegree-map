define(['jquery', 'ko', 'gmaps', 'view_model'], function ($, ko, gmaps, viewModel) {
  $('#wait_msg').hide();

  var moscow = new gmaps.LatLng(55.752532, 37.622828);

  var map = new gmaps.Map(document.getElementById('map-canvas'), {
    center: moscow,
    zoom: 15,
    disableDefaultUI: true
  });

  var request = {
    location: moscow,
    radius: '1500',
    types: ['museum']
  };

  var service = new gmaps.places.PlacesService(map);
  service.nearbySearch(request, callback);

  function callback(results, status) {
    viewModel.museums.removeAll();
    if (status == gmaps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);

        viewModel.museums.push({title: place.name});
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new gmaps.Marker({
      map: map,
      position: place.geometry.location
    });

    gmaps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }

  ko.applyBindings(viewModel);
});
