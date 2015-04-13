define(['jquery',
        'config', 'map',
        'list_vm', 'geopos_vm'
       ],
       function ($, config, map) {
         $('#wait_msg').hide();

         map.changeLocation(config.defaults.center.lat, config.defaults.center.lng);
       });
