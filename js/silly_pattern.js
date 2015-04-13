define(['jquery', 'ko'], function($, ko) {
  // this is the pattern that kept popping up
  // while I was working on this project:
  // - a viewmodel defines itself inside a "define"
  // - it is instantiated and applied to "its view"
  // - the instance is now returned and is "requirable" elsewhere
  // Not sure if that's a good idea or not, but since it "emerged",
  // we have to keep it DRY, don't we?
  // @param {string} id - id of the html element which will be used as a view
  // @param {function} def - a constructor for the viewmodel
  return function(id, def) {
    // instantiate the viewmodel
    var vm = new def();

    // bind it to the view
    ko.applyBindings(vm, $('#' + id)[0]);

    // it is ready - kept it silly, simple(-minded one)?
    return vm;
  };
});
