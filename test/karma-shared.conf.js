// Karma configuration
// Generated on Sat Sep 28 2013 22:55:28 GMT+0700 (ICT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',


    // frameworks to use
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'src/*.js',
      'node_modules/chai/chai.js',
      'node_modules/sinon/pkg/sinon.js',
      'test/mocha.conf.js',
      {pattern: 'test/lib/*.js', included: true}
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage', 'junit'],

    preprocessors: {
        'src/*.js': ['coverage']
    },

    coverageReporter: {
        type : 'html',
        dir : 'coverage/'
    },

    junitReporter: {
        outputFile: 'test-results.xml',
        suite: ''
    },

    // web server port, need to change if got error
    port: 9872,

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
