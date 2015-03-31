define(['ko', 'jquery'], function(ko, $) {
  var GeoVM = function() {

    this.searchCenter = ko.observable("Moscow");

  };

//  $.getJSON("https://maps.googleapis.com/maps/api/geocode/output?parameters

  var vm = new GeoVM();
  ko.applyBindings(vm, $('#geo-view')[0]);

  return vm;
});
