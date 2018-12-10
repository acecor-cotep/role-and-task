"use strict";

module.exports = function(grunt) {
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
				dest: './compiled/',
			},
		},

		symlink: {
  		options: {
    		// Enable overwrite to delete symlinks before recreating them
    		overwrite: false,

				// Enable force to overwrite symlinks outside the current working directory
    		force: false,
  		},

			// The "build/target.txt" symlink will be created and linked to
  		// "source/target.txt". It should appear like this in a file listing:
  		// build/target.txt -> ../source/target.txt
  		explicit: {
    		src: 'views',
    		dest: 'compiled/views'
  		},
		},
	});

	grunt.loadNpmTasks('grunt-newer');
	grunt.registerTask('default', ['newer:babel']);

	grunt.loadNpmTasks('grunt-contrib-symlink');
};
