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

// TODO: setup somekind of timeout - for 10 seconds or so - which will inform that gmaps is not here???
function doit() {
  console.log("do it!!!");
  require(['js/app.js']);
}
