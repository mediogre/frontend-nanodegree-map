define(['jquery', 'ko', 'map', 'view_model', //'geo_view_model',
        'third_party_api'],
       function ($, ko, map, viewModel, //geo,
                 third_party) {
         $('#wait_msg').hide();
         ko.applyBindings(viewModel, $('#list-view')[0]);
       });
