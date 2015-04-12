define(['jquery', 'ko', 'map', 'view_model',
        'geo_view_model', 'third_party_api',
        'config'], function ($, ko, map, viewModel, geo, third_party, config) {
          $('#wait_msg').hide();
          ko.applyBindings(viewModel, $('#list-view')[0]);

          map.changeLocation(config.defaults.center.lat, config.defaults.center.lng);
});
