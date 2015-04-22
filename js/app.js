define(['jquery',
        'config',
        'list_vm', 'geopos_vm'
       ],
       function ($, config, lvm) {
         $('#wait_msg').hide();

         lvm.changeLocation(config.defaults.center.lat, config.defaults.center.lng);
       });
