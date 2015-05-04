module.exports = function(grunt) {
  // high-level overview of what we want to achieve:
  // - make sure we have build directory created and clean (grunt-contrib-clean)
  // - invoke r.js so that it could generate an optimized single .js (grunt-contrib-requires)
  // - concat css into a single css (grunt-contrib-concat)
  // - minify obtained css? (grunt-contrib-cssmin)
  // - change index.html to final css (grunt-usemin)
  // - no changes needed for index.html to use final js? (but in that case (grunt-usemin) as well)
  
  grunt.registerTask('default', function() {
    console.log("Grunt is here... Have no fear!");
  });

  
};
