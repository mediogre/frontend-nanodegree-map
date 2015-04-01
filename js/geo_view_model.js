define(['ko', 'jquery', 'third_party_api'], function(ko, $, third_party) {
  var GeoVM = function() {

    this.searchCenter = ko.observable("Moscow");

    this.listOfLocations = ko.observableArray([]);
  };

  var vm = new GeoVM();
  ko.applyBindings(vm, $('#geo-view')[0]);

  return vm;
});
