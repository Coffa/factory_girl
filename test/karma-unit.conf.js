var shared = require('./karma-shared.conf');

module.exports = function(config) {
  shared(config);
  config.files = config.files.concat([
    {pattern: 'test/unit/*Spec.js', included: true}
  ])
};
