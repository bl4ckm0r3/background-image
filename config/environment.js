/*jshint node:true*/
'use strict';

module.exports = function(environment) {
  var ENV = {
    environment: environment,
    contentSecurityPolicy: {
      'img-src': "'self' data",
      'script-src': "'self'",
      'style-src': "'self' 'unsafe-inline'"
    }
  }
  return ENV;
};
