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
    'LocalStorageModule'
    // 'node.fs.app'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }]);
