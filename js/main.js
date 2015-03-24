// define jquery
define('jquery', function() {
  return jQuery;
});

// define knockout
define('ko', function () {
  return ko;
});

// load google maps
var script = document.createElement("script");

// in case google maps is not loading - gracefully report
script.onerror = function(event) {
  console.log("You have no conscience");
};

// otherwise - define google maps and call into the app
script.onload = function(event) {
  // the app is then blissfully unaware of all the loading hoops we went through
  console.log("Ok - google is here");
  console.log(google.maps);
};

script.src="https://maps.googleapis.com/maps/api/js?libraries=places&callback=doit";
document.body.appendChild(script);
setTimeout(function () {
  var el = document.getElementById('wait_msg');
  if (typeof google === 'undefined') {
    el.innerHTML = 'Google Maps API is not available - please try again later!';
  }
}, 5000);
// TODO: setup somekind of timeout - for 10 seconds or so - which will inform that gmaps is not here???
function doit() {
  console.log("do it!!!");

  define('gmaps', function () {
    return google.maps;
  });
  require(['js/app.js']);
}
