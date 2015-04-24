// This module is just a plumbing component which
// provides a set of utilities 'talking' to 3rd-parties, like
// wikipedia or google geocoding.
// In a sense this is a simple interface for all those 3rd parties:
// for geocode we want to give a searchString and get a list of locations
// or be notified of the error.
// All the details of underlying API, parsing, etc is this utility function's job
// and we don't want any part of that
// Actual APIs are implemented as a separate modules apis/xxx, apis/yyy, etc
// This is a facade which brings them all together for easier use.
define(['apis/places', 'apis/geocode', 'apis/street_image',
        'apis/wikipedia_image', 'apis/wikipedia_extract',
        'apis/foursquare'],
       function(gmapPlaces, geocode, streetImageURL,
                wikipediaImages, wikipediaExtract,
                fourSquare) {
  // export our third-party API low-level routines
  return {
    googleGeocoding: geocode,
    wikipediaImages: wikipediaImages,
    wikipediaExtract: wikipediaExtract,
    streetImageURL: streetImageURL,
    fourSquare: fourSquare,
    gmapPlaces: gmapPlaces
  };
});
