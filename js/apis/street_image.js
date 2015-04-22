define(function() {
  // returns URL to street image using Static Street View API
  return function(lat, lng, sizex, sizey) {
    if (!sizex) {
      sizex = 200;
    }
    if (!sizey) {
      sizey = 200;
    }

    return 'https://maps.googleapis.com/maps/api/streetview?size=' + sizex + 'x' + sizey + '&location=' + lat + ',' + lng;
  };
});
