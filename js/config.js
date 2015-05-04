define(function() {
  // this is the object used to store all the various configuraton settings used by the app
  return {
    // default values - used by various components of the app, mostly by 'map'
    defaults: {
      // initial "location"
      centerLocation: 'Moscow',
      
      // Moscow location to be used for initial map center
      center:  {lat: 55.752532, lng: 37.622828},

      // default zoom level
      zoom: 15,

      // used as a default radius (in meters) for nearbysearch in Places API
      radius: 1500
    },

    fourSquareToken: 'KYYBOHEBI2LNNRBNAMYHYPSL0LTDM1LYYYJEWVGVVNDLA0AA',

    // time in milliseconds to stop happy marker bouncing
    bounceTime: 1500
  };
});
