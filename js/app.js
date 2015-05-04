define(['jquery', 'config', 'list_vm', 'geopos_vm'], function ($, config, lvm) {
  // hide 'loading' message
  $('#wait_msg').hide();

  // jump to our default location
  lvm.changeLocation(config.defaults.center.lat, config.defaults.center.lng);
});
