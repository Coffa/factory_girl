var bower = require('bower');
var util = require('./utils.js');
var spawn = require('child_process').spawn;

module.exports = function(grunt) {

  grunt.registerMultiTask('build', 'build JS files', function(){
    util.build.call(util, this.data, this.async());
  });

};
