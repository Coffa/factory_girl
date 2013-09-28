var fs = require('fs');
var shell = require('shelljs');
var grunt = require('grunt');
var spawn = require('child_process').spawn;
var version;

module.exports = {

  getVersion: function(){
    if (version) return version;

    var package = JSON.parse(fs.readFileSync('package.json', 'UTF-8'));
    var match = package.version.match(/^([^\-]*)(?:\-(.+))?$/);
    var semver = match[1].split('.');
    var hash = shell.exec('git rev-parse --short HEAD', {silent: true}).output.replace('\n', '');

    var fullVersion = match[1];

    if (match[2]) {
      fullVersion += '-';
      fullVersion += (match[2] == 'snapshot') ? hash : match[2];
    }

    version = {
      full: fullVersion,
      major: semver[0],
      minor: semver[1],
      dot: semver[2].replace(/rc\d+/, ''),
      codename: package.codename,
      cdn: package.cdnVersion
    };

    return version;
  },


  wrap: function(src, name){
    src.unshift('src/' + name + '.prefix');
    src.push('src/' + name + '.suffix');
    return src;
  },

  process: function(src, VERSION, strict){
    var processed = src
      .replace(/"VERSION_FULL"/g, VERSION.full)
      .replace(/"VERSION_MAJOR"/, VERSION.major)
      .replace(/"VERSION_MINOR"/, VERSION.minor)
      .replace(/"VERSION_DOT"/, VERSION.dot)
      .replace(/"VERSION_CDN"/, VERSION.cdn)
      .replace(/"VERSION_CODENAME"/, VERSION.codename);
    if (strict !== false) processed = this.singleStrict(processed, '\n\n', true);
    return processed;
  },


  build: function(config, fn){
    var files = grunt.file.expand(config.src);
    //concat
    var src = files.map(function(filepath){
      return grunt.file.read(filepath);
    }).join(grunt.util.normalizelf('\n'));
    //process
    var processed = this.process(src, grunt.config('VERSION'), config.strict);
    //write
    grunt.file.write(config.dest, processed);
    grunt.log.ok('File ' + config.dest + ' created.');
    fn();
  },


  singleStrict: function(src, insert){
    return src
      .replace(/\s*("|')use strict("|');\s*/g, insert) // remove all file-specific strict mode flags
      .replace(/(\(function\([^)]*\)\s*\{)/, "$1'use strict';"); // add single strict mode flag
  },
};
