define(['ko', 'jquery', 'third_party_api'], function(ko, $, third_party) {
  var VM = function() {
    var self = this;
    
    this.title = ko.observable();
    this.url   = ko.observable();

    this.title.subscribe(function(v) {
      third_party.wikipediaImages(v).done(function(obj) {
        self.url(obj.url);
      }).fail(function(msg) {
        // TODO: show error/fail message
      });
    });    
  };
  
  var vm = new VM();
  ko.applyBindings(vm, $('#wiki-image')[0]);
  return vm;
});
