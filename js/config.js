define(function() {
  // not much to config yet - but things like API_KEY, etc can be put in this object later
  return {
    // default values - used by various components of the app, mostly by 'map'
    defaults: {
      // Moscow location to be used for initial map center
      center:  {lat: 55.752532, lng: 37.622828},

      // default zoom level
      zoom: 15
    }
  };
});
