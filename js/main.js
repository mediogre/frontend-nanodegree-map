(function (doc) {
  var googleMapsFailed = function() {
    if (typeof google === 'undefined') {
      var el = doc.getElementById('wait_msg');
      el.innerHTML = 'Google Maps API is not available - please try again later!';
    }
  };

  // load google maps
  var script = doc.createElement("script");

  // in case google maps is not loading - gracefully report
  script.onerror = function(event) {
    googleMapsFailed();
  };

  script.src="https://maps.googleapis.com/maps/api/js?libraries=places&callback=alrightRequireItIs";
  doc.body.appendChild(script);

  // on successful gmaps API loading our alrightRequireItIs will run and start the actual app,
  // but we have no good way of knowing if it failed
  // so we'll try to check if it has loaded in 5 seconds and if 'google' global has not appeared
  // we'll assume that something has gone wrong and let user know to try again later
  setTimeout(googleMapsFailed, 5000);
})(document);

// this is the callback which google maps api will call indicating that it is finished loading
// now we simply start our app and it's completely oblivious to all the troubles we went through
//
function alrightRequireItIs() {
  // define gmaps to allow our app to depend on it and not use globals
  define('gmaps', function () {
    return google.maps;
  });

  require.config({
    baseUrl: './js/',
    paths: {
      jquery: 'lib/jquery-1.11.2.min',
      'jquery.growl': 'lib/jquery.growl',
      'ko': 'lib/knockout-3.3.0'
    },

    shim: {
      'jquery.growl': ['jquery'],
      'ko': ['jquery']
    }
  });

  // finally!!!
  require(['app']);
}
