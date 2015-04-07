define(['ko', 'third_party_api'], function(ko, third_party) {
  var VM = function() {
    var self = this;

    this.location = ko.observable();
    this.url = ko.observable();

    this.location.subscribe(function(v) {
      self.url(third_party.streetImageURL(v.lat, v.lng));
    });
  };

  var vm = new VM();
  ko.applyBindings(vm, $('#street-image')[0]);
  return vm;
});
