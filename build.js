({
  baseUrl: './js/',
  paths: {
    jquery: 'lib/jquery-1.11.2.min',
    'jquery.growl': 'lib/jquery.growl',
    'ko': 'lib/knockout-3.3.0'
  },

  shim: {
    'jquery.growl': ['jquery'],
    'ko': ['jquery']
  },

  name: "main",
  out: "main-built.js"
});
