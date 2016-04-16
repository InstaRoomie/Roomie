module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['public/app/**/**.js'],
        dest: 'dist/built.js',
      }
    },
    src: 'path/to/files/*.js',
    options: {
      config: '.jscsrc',
      esnext: true,
      verbose: true,
      fix: true,
      requireCurlyBraces: ['if']
    },
    uglify: {
      options: {
        mangle: false
      },
      /*main: {
    		src: ['dist/built.js'],
    		dest: 'public/dist/app.min.js'
    	},*/
      my_target: {
        files: {
          'public/dist/app.min.js': ['dist/built.js']
        }
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jscs');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);

};
