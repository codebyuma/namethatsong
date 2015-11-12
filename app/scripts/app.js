'use strict';

/**
 * @ngdoc overview
 * @name ntsApp
 * @description
 * # ntsApp
 *
 * Main module of the application.
 */
angular.module('ntsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'firebase.ref',
    'LocalStorageModule',
    'spotify'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }])
  .config(function (SpotifyProvider) {
	  SpotifyProvider.setClientId('7025ce5e8b8d4e839abd1fc0ba0fff17');
	  // SpotifyProvider.setRedirectUri('<CALLBACK_URI>');
	  // SpotifyProvider.setScope('<SCOPE>');
	  // If you already have an auth token
	  SpotifyProvider.setAuthToken('BQB_66d_jYQS7XRG_1v8g78h7_3cXNP5tuduFQL35EkFDCCVVBiuVfp9_TYQLqKzRHVCdvWNCPFQ8AGZw47oQmjtHEfHaPeJ1AtogzWG2Y4Woc4C2D_-Bkh5iAGF33kmMRVmB98');
	});
