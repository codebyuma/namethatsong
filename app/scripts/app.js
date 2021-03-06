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
     'ngRoute',
    'firebase',
    'firebase.ref',
    'LocalStorageModule',
    'ngAudio',
    'ui.router',
    'timer'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }]);
