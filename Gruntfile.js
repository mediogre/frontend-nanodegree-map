module.exports = function(grunt) {
  // high-level overview of what we want to achieve:
  // - make sure we have build directory created and clean (grunt-contrib-clean)
  // - invoke r.js so that it could generate an optimized single .js (grunt-contrib-requirejs)
  // - concat css into a single css (grunt-contrib-concat)
  // - minify obtained css (grunt-contrib-cssmin)
  // - copy index.html+require.js to build dir (grunt-contrib-copy)
  // change index.html to final css (grunt-usemin)

  grunt.initConfig({
    requirejs: {
      compile: {
        options: {
          baseUrl: "./js/",

          paths: {
            jquery: 'lib/jquery-1.11.2.min',
            'jquery.growl': 'lib/jquery.growl',
            'ko': 'lib/knockout-3.3.0'
          },

          shim: {
            'jquery.growl': ['jquery'],
            'ko': ['jquery']
          },

          name: "main",
          out: "build/js/main.js"
        }
      }
    },

    clean: ['build'],

    copy: {
      'index.html': {
        src: 'index.html',
        dest: 'build/'
      },
      'require.js': {
        src: 'js/lib/require.js',
        dest :'build/'
      }
    },

    useminPrepare: {
      html: 'index.html',
      options: {
        dest: 'build/'
      }
    },

    usemin: {
      html: 'build/index.html'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('default', [
    'clean',
    'requirejs',
    'useminPrepare',
    'concat:generated', 'cssmin:generated',
    'copy:index.html', 'copy:require.js',
    'usemin'
  ]);
};
