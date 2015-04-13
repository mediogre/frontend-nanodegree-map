define(['ko', 'third_party_api', 'silly_pattern'], function(ko, api, silly) {
  return silly('wiki-image', function() {
    var self = this;
    
    this.title = ko.observable();
    this.url   = ko.observable();

    this.title.subscribe(function(v) {
      api.wikipediaImages(v).done(function(obj) {
        self.url(obj.url);
      }).fail(function(msg) {
        // TODO: show error/fail message
      });
    });    
  });
});
