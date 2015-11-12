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
    'spotify',
    'ngAudio',
    'ui.router'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }])
  .config(function (SpotifyProvider) {
	  SpotifyProvider.setClientId('7025ce5e8b8d4e839abd1fc0ba0fff17');
	  // SpotifyProvider.setRedirectUri('http://localhost:9000/');

	  // SpotifyProvider.setScope('<SCOPE>');
	  // If you already have an auth token
	 // SpotifyProvider.setAuthToken('BQAoVaA5PJeTfCvwdIFBkNjtcSzWyeBCJGATvZcPK7yQh1yhyezZjJa9hZNelgBUAeHL1AQBjuG7VCNvObocIMqR0gKAOpNAs_CfJ-LC0RfFTBjTpfHtub_lkNYTfWva1ZL8h4E');
	});
