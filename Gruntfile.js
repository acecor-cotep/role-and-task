"use strict";

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: true,
      },
      files: {
        expand: true,
        src: ['./src/**/*.es6', './test/**/*.es6'],
        ext: '.js',
        dest: './build/',
      },
    },
  });

  grunt.loadNpmTasks('grunt-newer');
  grunt.registerTask('default', ['newer:babel']);
};
